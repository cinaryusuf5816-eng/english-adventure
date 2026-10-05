// Converts the original illustrations in raw-images/<folder>/<name>.(jpg|png)
// into compressed WebP files for the site:
//   site/assets/images/<folder>/<name>-lg.webp  (large, classroom / whiteboard)
//   site/assets/images/<folder>/<name>-sm.webp  (small screens, cards)
// Run: npm run images   (development only — the published site needs nothing)
import sharp from 'sharp';
import { readdirSync, mkdirSync, statSync } from 'node:fs';
import { join, parse } from 'node:path';

const RAW = 'raw-images';
const OUT = 'site/assets/images';
const SIZES = { lg: 1400, sm: 720 };

let count = 0;
for (const folder of readdirSync(RAW)) {
  const dir = join(RAW, folder);
  if (!statSync(dir).isDirectory()) continue;
  mkdirSync(join(OUT, folder), { recursive: true });
  for (const file of readdirSync(dir)) {
    const { name, ext } = parse(file);
    if (!/^\.(jpe?g|png)$/i.test(ext)) continue;
    if (name !== name.toLowerCase()) throw new Error(`Use lower-case file names: ${file}`);
    const src = join(dir, file);
    const meta = await sharp(src).metadata();
    for (const [suffix, width] of Object.entries(SIZES)) {
      const target = join(OUT, folder, `${name}-${suffix}.webp`);
      const info = await sharp(src)
        .resize({ width: Math.min(width, meta.width), withoutEnlargement: true })
        .webp({ quality: suffix === 'lg' ? 80 : 76 })
        .toFile(target);
      console.log(`${target}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
      count++;
    }
  }
}
console.log(`Done: ${count} files.`);
