---
name: ui-check
description: Checks the portfolio's UI in a real browser across screen sizes, light/dark mode and reduced motion, then reports layout bugs. Use when asked whether the site works on all screen sizes, is responsive, or looks right on mobile/desktop, before opening a PR that touches markup or styles, or when the user runs /ui-check. Optional args - page paths (e.g. "/ /contact") to limit the check.
---

# UI check

Find layout bugs the way a careful reviewer would: measure what can be
measured, then actually look at the pages. Report findings; don't fix them in
the same pass unless asked (fixes go on their own branch, see AGENTS.md).

## 1. Start the dev server

```sh
astro dev status || astro dev --background
```

If `package-lock.json` just changed, the server restarts itself; wait for
`astro dev logs` to say "ready" before continuing.

## 2. Run the measurements

```sh
node .claude/skills/ui-check/scripts/audit.mjs --out=<scratchpad>/ui-check
```

- Limit scope with `--pages=/,/contact` or `--widths=320,1440`; `--no-shots`
  skips screenshots for a quick re-check after a fix.
- It launches the installed Google Chrome headless (override with
  `CHROME=/path`), so it works without the Claude in Chrome extension. If
  the extension *is* connected and the user wants to watch, the same checks
  can be done there with `resize_window` + `javascript_tool`.

For every page (static pages plus each `src/content/projects/*.mdx`) at 320 to
1920px, it reports:

| Check | Catches |
| --- | --- |
| Horizontal scroll / elements past the viewport | Fixed widths, long words, wide tables or images |
| Clipped glyphs | Text cut by an `overflow-hidden` parent: italic overhangs and descenders under reveal-animation masks |
| Text vs `aria-label` | Words that run together because animated word spans have no whitespace between them |
| Tap targets < 24px (count only) | Hard-to-tap links on touch screens; ignore desktop-only nav |

A clean measurement run is not a pass. Continue to step 3.

## 3. Look at the screenshots

The script writes viewport-sized screenshots, scrolling down each page, for
320 dark, 375 light/dark, 768 dark and 1440 light/dark, plus the open mobile
menu and phone landscape. Read them, starting with the top screen of each
page, and look for:

- Hero headline: words spaced, nothing clipped, fits at 320px
- Nav: inline links at 768px and up, hamburger below; menu opens and covers the page
- Grids collapse to one column on mobile without awkward gaps
- Text contrast and borders hold up in both light and dark mode
- Forms: inputs full width on mobile, button reachable
- Phone landscape: hero still readable

## Pitfalls (learned the hard way)

- **Animations.** Without reduced motion, screenshots catch words mid-slide or
  invisible. The script emulates `prefers-reduced-motion: reduce`. Also check
  reduced motion by itself if the change touched animation.
- **Tall windows distort the page.** The hero is `min-h-[92svh]`, so a
  3000px-tall window, or a full-page "capture beyond viewport" screenshot,
  stretches or rescales it and can produce fake bugs. Use real device heights
  and scroll instead. If something looks wrong only in a screenshot, measure
  it with `getComputedStyle` / `getBoundingClientRect` before reporting it.
- **The Astro dev toolbar** is the dark pill at the bottom. It isn't on the
  live site. The script removes it.
- **Scroll containers aren't overflow.** A code block that scrolls sideways
  inside `<pre>` is fine; only the page itself scrolling sideways is a bug.

## 4. Report

Lead with the verdict. Then:

1. **What works**: a short list by area (layout, nav, grids, forms).
2. **Bugs**: each with the widths affected, `file:line`, the cause, and
   the screenshot that shows it.
3. **Minor**: items worth knowing that don't need fixing now.

Offer to fix the bugs in a separate `fix/...` branch and PR.
