// Converts the original artwork in design/source-art/app/*.png to WebP in public/assets/.
// Lossy WebP at q90 (PSNR ≥ 37 dB); transparent cut-outs keep a lossless alpha channel.
// Run: node scripts/optimize-art.mjs
import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'design/source-art/app';
const OUT = 'public/assets';

await mkdir(OUT, { recursive: true });
let before = 0;
let after = 0;
for (const file of (await readdir(SRC)).filter((f) => f.endsWith('.png')).sort()) {
  const input = path.join(SRC, file);
  const output = path.join(OUT, file.replace(/\.png$/, '.webp'));
  const { hasAlpha } = await sharp(input).metadata();
  await sharp(input)
    .webp({ quality: 90, alphaQuality: 100, effort: 6, smartSubsample: true })
    .toFile(output);
  const a = (await stat(input)).size;
  const b = (await stat(output)).size;
  before += a;
  after += b;
  console.log(`${file.padEnd(24)} ${(a / 1024).toFixed(0).padStart(6)} KB -> ${(b / 1024).toFixed(0).padStart(5)} KB${hasAlpha ? '  (alpha)' : ''}`);
}
console.log(`total ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(2)} MB`);
