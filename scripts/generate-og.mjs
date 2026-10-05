// Renders public/og-image.png (the link-preview image) from site data.
// Run with `npm run og` after changing your name or role.
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const src = await readFile(new URL('../src/data/site.ts', import.meta.url), 'utf8');
const pick = (key) => src.match(new RegExp(`${key}: '([^']+)'`))?.[1] ?? '';
const name = pick('name');
const role = pick('role');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f5f2ea"/>
  <path transform="translate(1010 70) scale(1.1)" d="M64 18c4 30 16 42 46 46-30 4-42 16-46 46-4-30-16-42-46-46 30-4 42-16 46-46Z" fill="#c2603d"/>
  <text x="80" y="120" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="6" fill="#6b675d">${role.toUpperCase()}</text>
  <text x="74" y="430" font-family="Georgia, 'Times New Roman', serif" font-size="150" letter-spacing="-4" fill="#1a1915">${name}</text>
  <rect x="80" y="500" width="120" height="4" fill="#c2603d"/>
  <text x="80" y="560" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#6b675d">Portfolio · Projects · Contact</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(new URL('../public/og-image.png', import.meta.url).pathname);
console.log('Wrote public/og-image.png');
