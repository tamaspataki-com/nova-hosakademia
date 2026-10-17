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

// Bátorság bolygója covers: design/source-art/courage/*.png (1536 × 1024 masters) -> a 1536 × 1024 and a 768 × 512 WebP
// in public/assets/. Size limits (as the other covers): <= 450 KB for the large file, <= 100 KB for the 768 px file; the
// quality starts at 90 and is lowered in steps only if a file is over its limit.
const COURAGE = 'design/source-art/courage';
const LIMITS = { 1536: 450 * 1024, 768: 100 * 1024 };
try {
  for (const file of (await readdir(COURAGE)).filter((f) => f.endsWith('.png')).sort()) {
    const name = file.replace(/\.png$/, '');
    const meta = await sharp(path.join(COURAGE, file)).metadata();
    if (meta.width !== 1536 || meta.height !== 1024) throw new Error(`${file} is ${meta.width}x${meta.height}, expected 1536x1024`);
    for (const width of [1536, 768]) {
      const output = path.join(OUT, width === 1536 ? `${name}.webp` : `${name}-768.webp`);
      let q = 90;
      let size;
      do {
        await sharp(path.join(COURAGE, file))
          .resize({ width, height: Math.round((width * 2) / 3) })
          .webp({ quality: q, effort: 6, smartSubsample: true })
          .toFile(output);
        size = (await stat(output)).size;
        q -= 4;
      } while (size > LIMITS[width] && q > 60);
      console.log(`${(name + (width === 768 ? '-768' : '')).padEnd(28)} ${width}x${Math.round((width * 2) / 3)}  q${q + 4}  ${(size / 1024).toFixed(0)} KB${size > LIMITS[width] ? '  OVER LIMIT' : ''}`);
    }
  }
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
}
