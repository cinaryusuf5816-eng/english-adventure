// Makes the two delivery packages from the same version:
//   release/READY_TO_UPLOAD.zip  → contents of dist/ at the top level (index.html, .nojekyll, …)
//   release/SOURCE_CODE.zip      → the full project without node_modules, dist, release, temp files
// Run after `npm run build`:  npm run package
import archiver from 'archiver';
import { createWriteStream, mkdirSync, existsSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';

if (!existsSync('dist/index.html')) {
  console.error('dist/ is missing. Run npm run build first.');
  process.exit(1);
}
mkdirSync('release', { recursive: true });

const SOURCE_EXCLUDE = [
  /^node_modules(\/|$)/, /^dist(\/|$)/, /^release(\/|$)/, /^\.git(\/|$)/,
  /^tests\/\.tmp(\/|$)/, /^tests\/e2e\/screenshots(\/|$)/, /^\.claude(\/|$)/,
  /(^|\/)\.env/, /(^|\/)(Thumbs\.db|\.DS_Store)$/, /\.log$/
];

function listFiles(root, exclude = []) {
  const out = [];
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const rel = relative(root, full).split(sep).join('/');
      if (exclude.some((re) => re.test(rel))) continue;
      if (statSync(full).isDirectory()) walk(full);
      else out.push({ full, rel });
    }
  })(root);
  return out.sort((a, b) => a.rel.localeCompare(b.rel));
}

function zip(target, files) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(target);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', () => resolve(archive.pointer()));
    archive.on('error', reject);
    archive.pipe(output);
    // Fixed date so the same files give the same archive.
    for (const f of files) archive.file(f.full, { name: f.rel, date: new Date('2026-01-01T00:00:00Z') });
    archive.finalize();
  });
}

function digest(files) {
  const h = createHash('sha256');
  for (const f of files) { h.update(f.rel); h.update(readFileSync(f.full)); }
  return h.digest('hex').slice(0, 16);
}

const ready = listFiles('dist');
const source = listFiles('.', SOURCE_EXCLUDE);

const r1 = await zip('release/READY_TO_UPLOAD.zip', ready);
const r2 = await zip('release/SOURCE_CODE.zip', source);

// Both packages must carry the same site files.
const siteInSource = source.filter((f) => f.rel.startsWith('site/')).map((f) => ({ ...f, rel: f.rel.slice(5) }));
const readyNoBuild = ready.filter((f) => f.rel !== 'data/build.json');
const same = digest(readyNoBuild) === digest(siteInSource);
console.log(`READY_TO_UPLOAD.zip  ${ready.length} files  ${(r1 / 1024 / 1024).toFixed(2)} MB`);
console.log(`SOURCE_CODE.zip      ${source.length} files  ${(r2 / 1024 / 1024).toFixed(2)} MB`);
console.log(`Site files identical in both packages: ${same ? 'yes' : 'NO'}`);
if (!same) process.exit(1);
if (!ready.some((f) => f.rel === 'index.html') || !ready.some((f) => f.rel === '.nojekyll')) {
  console.error('index.html or .nojekyll is not at the top of READY_TO_UPLOAD.zip');
  process.exit(1);
}
