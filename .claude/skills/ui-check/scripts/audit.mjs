#!/usr/bin/env node
// Responsive UI audit for the portfolio. Zero dependencies: drives the
// installed Google Chrome over the DevTools protocol (Node 22+ WebSocket).
//
//   node .claude/skills/ui-check/scripts/audit.mjs [--out=DIR] [--base=URL]
//        [--pages=/,/work] [--widths=320,768] [--no-shots]
//
// Prints a measurement report per page × width and writes viewport-sized
// screenshots to --out for visual review.

import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  }),
);

const BASE = args.base ?? 'http://localhost:4321';
const OUT = args.out ?? join(tmpdir(), 'ui-check');
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9333;

const slugs = readdirSync('src/content/projects')
  .filter((f) => /\.mdx?$/.test(f))
  .map((f) => f.replace(/\.mdx?$/, ''));
const PAGES = args.pages
  ? args.pages.split(',')
  : ['/', '/work', ...slugs.map((s) => `/work/${s}`), '/resume', '/contact', '/404'];
// Small phone → large desktop, including both sides of the md (768px) breakpoint.
const WIDTHS = args.widths ? args.widths.split(',').map(Number) : [320, 375, 414, 767, 768, 1024, 1440, 1920];
// Screenshot set: [width, height, color scheme]. Real device heights, never a
// tall window: the hero is min-h-[92svh] and would stretch.
const SHOTS = [
  [320, 640, 'dark'],
  [375, 812, 'light'],
  [375, 812, 'dark'],
  [768, 1024, 'dark'],
  [1440, 900, 'light'],
  [1440, 900, 'dark'],
];
const MAX_SCREENS = 6;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- Chrome / CDP plumbing ---------------------------------------------------

const profile = mkdtempSync(join(tmpdir(), 'ui-check-chrome-'));
const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  'about:blank',
], { stdio: 'ignore' });

async function connect() {
  for (let i = 0; i < 50; i++) {
    try {
      const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
      const ws = new WebSocket(t.webSocketDebuggerUrl);
      await new Promise((r, j) => ((ws.onopen = r), (ws.onerror = j)));
      return ws;
    } catch {
      await sleep(200);
    }
  }
  throw new Error(`Could not reach Chrome at ${CHROME}; set CHROME=/path/to/chrome`);
}

const ws = await connect();
let nextId = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  pending.get(m.id)?.(m);
  pending.delete(m.id);
};
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++nextId;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (fn, arg) => {
  const res = await send('Runtime.evaluate', {
    expression: `(${fn})(${JSON.stringify(arg)})`,
    awaitPromise: true,
    returnByValue: true,
  });
  if (res.result.exceptionDetails) throw new Error(res.result.exceptionDetails.exception?.description);
  return res.result.result.value;
};

async function load(path, width, height = 900, scheme = 'dark') {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 768 });
  // Reduced motion so every element is in its final, settled position.
  await send('Emulation.setEmulatedMedia', {
    features: [
      { name: 'prefers-reduced-motion', value: 'reduce' },
      { name: 'prefers-color-scheme', value: scheme },
    ],
  });
  await send('Page.navigate', { url: BASE + path });
  await sleep(1200);
  await evaluate(() => document.fonts.ready.then(() => true));
  // Hide Astro's dev toolbar so it doesn't cover content in screenshots.
  await evaluate(() => document.querySelector('astro-dev-toolbar')?.remove());
}

async function screenshot(name) {
  const { result } = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(OUT, `${name}.png`), Buffer.from(result.data, 'base64'));
}

// --- In-page checks (serialized and run in the browser) ----------------------

function measure() {
  const vw = document.documentElement.clientWidth;
  const hiddenish = (el) => el.closest('.sr-only, [hidden], script, style, astro-dev-toolbar');
  const describe = (el) => `<${el.tagName.toLowerCase()}> "${(el.textContent ?? '').trim().slice(0, 40)}"`;

  // 1. Elements sticking out past the viewport (scroll/clip containers and fixed overlays excluded).
  const overflow = [...document.querySelectorAll('body *')]
    .filter((el) => {
      if (hiddenish(el) || getComputedStyle(el).position === 'fixed') return false;
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        if (getComputedStyle(p).overflowX !== 'visible') return false;
      }
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.right > vw + 1 || r.left < -1);
    })
    .slice(0, 8)
    .map(describe);

  // 2. Glyph ink cut off by an overflow: hidden ancestor (italic overhangs,
  //    descenders under reveal masks). Layout boxes miss this, so ink bounds
  //    are measured with a canvas.
  const ctx = document.createElement('canvas').getContext('2d');
  const clipped = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent.trim();
    const el = node.parentElement;
    if (!text || hiddenish(el)) continue;
    let clip = null;
    for (let p = el; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (/hidden|clip/.test(s.overflowX + s.overflowY)) {
        clip = p;
        break;
      }
    }
    if (!clip || getComputedStyle(clip).textOverflow === 'ellipsis') continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = range.getClientRects();
    if (rects.length !== 1) continue; // ink only lines up with single-line text
    const style = getComputedStyle(el);
    ctx.font = style.font;
    ctx.letterSpacing = style.letterSpacing;
    const m = ctx.measureText(node.textContent);
    const r = rects[0];
    const baseline = r.top + m.fontBoundingBoxAscent;
    const ink = {
      left: r.left - m.actualBoundingBoxLeft,
      right: r.left + m.actualBoundingBoxRight,
      top: baseline - m.actualBoundingBoxAscent,
      bottom: baseline + m.actualBoundingBoxDescent,
    };
    const box = clip.getBoundingClientRect();
    const sides = ['left', 'right', 'top', 'bottom'].filter((s) =>
      s === 'left' || s === 'top' ? ink[s] < box[s] - 1 : ink[s] > box[s] + 1,
    );
    if (sides.length) clipped.push(`"${text.slice(0, 40)}" cut off on ${sides.join(', ')}`);
  }

  // 3. Elements whose aria-label replaces aria-hidden visual text must show the
  //    same words (catches missing spaces between animated word spans).
  const norm = (s) => s.replace(/[^\p{L}\p{N}\p{P}\s]/gu, '').replace(/\s+/g, ' ').trim();
  const labels = [...document.querySelectorAll('[aria-label]')]
    .filter((el) => el.children.length && [...el.children].every((c) => c.getAttribute('aria-hidden') === 'true'))
    .map((el) => [norm(el.getAttribute('aria-label')), norm(el.innerText)])
    .filter(([label, shown]) => shown && label !== shown)
    .map(([label, shown]) => `shows "${shown}", label is "${label}"`);

  // 4. Tap targets under 24px tall (WCAG 2.2 minimum), outside running text.
  const smallTargets = [...document.querySelectorAll('a, button, input, select, textarea, summary')]
    .filter((el) => {
      if (hiddenish(el) || el.closest('p, li > p, td')) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.height < 24;
    })
    .map(describe);

  return {
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: vw,
    overflow,
    clipped,
    labels,
    smallTargets,
  };
}

// --- Run ---------------------------------------------------------------------

let problems = 0;
try {
  mkdirSync(OUT, { recursive: true });
  console.log(`# Measurements (${BASE}, reduced motion)\n`);
  for (const path of PAGES) {
    for (const width of WIDTHS) {
      await load(path, width);
      const m = await evaluate(measure);
      const issues = [
        m.scrollWidth > m.clientWidth && `page scrolls horizontally (${m.scrollWidth} > ${m.clientWidth})`,
        ...m.overflow.map((x) => `past viewport edge: ${x}`),
        ...m.clipped.map((x) => `clipped glyphs: ${x}`),
        ...m.labels.map((x) => `text/label mismatch: ${x}`),
      ].filter(Boolean);
      problems += issues.length;
      const small = m.smallTargets.length ? `  (${m.smallTargets.length} tap targets < 24px)` : '';
      console.log(`${path.padEnd(32)} ${String(width).padStart(4)}px  ${issues.length ? 'FAIL' : 'ok'}${small}`);
      for (const issue of issues) console.log(`    - ${issue}`);
    }
  }

  if (!args['no-shots']) {
    for (const path of PAGES) {
      const slug = path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '-');
      for (const [w, h, scheme] of SHOTS) {
        await load(path, w, h, scheme);
        const total = await evaluate(() => document.documentElement.scrollHeight);
        const screens = Math.min(MAX_SCREENS, Math.ceil(total / h));
        for (let i = 0; i < screens; i++) {
          await evaluate((y) => window.scrollTo(0, y), i * h);
          await sleep(250);
          await screenshot(`${slug}_${w}_${scheme}_${String(i + 1).padStart(2, '0')}`);
        }
      }
    }
    await load('/', 375, 812, 'dark');
    await evaluate(() => document.querySelector('[data-menu-toggle]')?.click());
    await sleep(500);
    await screenshot('menu_375_dark');
    await load('/', 667, 375, 'dark');
    await screenshot('home_landscape_dark');
    console.log(`\nScreenshots: ${OUT}`);
  }
  console.log(`\n${problems ? `${problems} measured problem(s)` : 'No measured problems'}`);
} finally {
  ws.close();
  chrome.kill();
  rmSync(profile, { recursive: true, force: true });
}
