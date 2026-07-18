/**
 * Derive the brand logo variants from public/logo.png.
 *
 * Why this exists:
 *  - The source is 1600x800 with ~55% transparent padding. Dropped into a
 *    background-size:contain box it would render tiny.
 *  - The wordmark and tagline are near-white (#fcfbfa), so they vanish on light
 *    sections. The theme's trick — mix-blend-mode:difference on figure.logo —
 *    can't be reused: `difference` turns the crimson cyan. So we bake a real
 *    dark-background and light-background pair instead.
 *  - The tagline band is only 32px tall in the source. In the nav (25px tall)
 *    it renders as unreadable mush, so the nav lockup drops it.
 *
 * Colours are snapped to the stated brand values (#fe063b / #fcfbfa) rather than
 * the source's slightly-off #fb093b, keeping alpha so antialiasing survives.
 *
 * Run: node scripts/build-logo.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/logo.png";
const OUT = "public/brand";

const CRIMSON = [0xfe, 0x06, 0x3b]; // #fe063b
const PAPER = [0xfc, 0xfb, 0xfa]; // #fcfbfa — for dark backgrounds
const INK = [0x12, 0x14, 0x1a]; // theme ink — for light backgrounds

// Tagline band, measured from the source (text side only; the mark spans full height).
const TAGLINE = { x: 520, y0: 450, y1: 500 };

const isReddish = (r, g, b) => r > g + 40 && r > b + 40;
const isPaperish = (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b) < 45 && Math.max(r, g, b) > 110;

async function build({ name, textColour, dropTagline }) {
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: ch } = info;
  const buf = Buffer.from(data);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * ch;
      const a = buf[i + 3];
      if (a === 0) continue;

      if (dropTagline && x >= TAGLINE.x && y >= TAGLINE.y0 && y <= TAGLINE.y1) {
        buf[i + 3] = 0;
        continue;
      }

      const [r, g, b] = [buf[i], buf[i + 1], buf[i + 2]];
      if (isReddish(r, g, b)) {
        [buf[i], buf[i + 1], buf[i + 2]] = CRIMSON;
      } else if (isPaperish(r, g, b)) {
        [buf[i], buf[i + 1], buf[i + 2]] = textColour;
      }
    }
  }

  // Compute the alpha bbox ourselves. sharp's .trim() keys off the top-left
  // pixel and silently no-ops on a fully transparent border.
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (buf[(y * w + x) * ch + 3] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) throw new Error(`${name}: no opaque pixels`);

  const pad = 4;
  const left = Math.max(0, x0 - pad);
  const top = Math.max(0, y0 - pad);
  const width = Math.min(w - left, x1 - x0 + 1 + pad * 2);
  const height = Math.min(h - top, y1 - y0 + 1 + pad * 2);

  const out = `${OUT}/${name}.png`;
  await sharp(buf, { raw: { width: w, height: h, channels: ch } })
    .extract({ left, top, width, height })
    .png({ compressionLevel: 9 })
    .toFile(out);

  const meta = await sharp(out).metadata();
  console.log(`  ${out.padEnd(38)} ${meta.width}x${meta.height}`);
  return out;
}

await mkdir(OUT, { recursive: true });
console.log("building brand variants from", SRC);

// nav lockup — tagline dropped (illegible at 25px)
await build({ name: "orbitworks-light", textColour: PAPER, dropTagline: true });
await build({ name: "orbitworks-dark", textColour: INK, dropTagline: true });
// full lockup — keeps the tagline, for larger placements
await build({ name: "orbitworks-full-light", textColour: PAPER, dropTagline: false });
await build({ name: "orbitworks-full-dark", textColour: INK, dropTagline: false });

console.log("done");
