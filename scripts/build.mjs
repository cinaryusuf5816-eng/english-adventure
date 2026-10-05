// Build = copy the static site to dist/ and check it.
// The site has no compile step (plain HTML, CSS and JavaScript modules), so dist/
// is exactly what GitHub Pages serves. Run: npm run build
import { rmSync, cpSync, readdirSync, statSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const SRC = 'site';
const OUT = 'dist';

rmSync(OUT, { recursive: true, force: true });
cpSync(SRC, OUT, {
  recursive: true,
  filter: (p) => !/(^|[\\/])(Thumbs\.db|\.DS_Store)$/.test(p)
});

// Version stamp (visible in data/build.json, handy when checking what is online).
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
writeFileSync(join(OUT, 'data', 'build.json'), JSON.stringify({ version: pkg.version, builtAt: new Date().toISOString() }, null, 2) + '\n');

// Check the built copy (paths, letter case, counts).
execFileSync(process.execPath, ['scripts/validate-content.mjs', OUT], { stdio: 'inherit' });

let files = 0;
let bytes = 0;
(function walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    const s = statSync(p);
    if (s.isDirectory()) walk(p); else { files += 1; bytes += s.size; }
  }
})(OUT);
console.log(`\nBuilt ${OUT}/: ${files} files, ${(bytes / 1024 / 1024).toFixed(2)} MB`);
