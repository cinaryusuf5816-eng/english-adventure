// Tiny static server for local preview and tests (development only).
// Usage: node scripts/serve.mjs <folder> <port> [--base /test-repo/]
// With --base, files are served ONLY under that path (like GitHub Pages project sites).
import http from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { resolve, join, extname, sep } from 'node:path';

const args = process.argv.slice(2);
const root = resolve(args[0] || 'site');
const port = Number(args[1] || 8080);
const baseIdx = args.indexOf('--base');
const base = baseIdx >= 0 ? args[baseIdx + 1].replace(/\/?$/, '/') : '/';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8'
};

export function startServer({ dir = root, portNo = port, basePath = base } = {}) {
  const rootDir = resolve(dir);
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    let path = decodeURIComponent(url.pathname);
    if (!path.startsWith(basePath)) {
      if (path === basePath.slice(0, -1)) { res.writeHead(301, { Location: basePath }); return res.end(); }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found (outside base path)');
    }
    path = path.slice(basePath.length);
    if (path === '' || path.endsWith('/')) path += 'index.html';
    const file = resolve(join(rootDir, path));
    if (!file.startsWith(rootDir + sep) && file !== rootDir) { res.writeHead(403); return res.end(); }
    let st;
    try { st = statSync(file); } catch { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    if (st.isDirectory()) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream', 'Content-Length': st.size, 'Cache-Control': 'no-cache' });
    createReadStream(file).pipe(res);
  });
  return new Promise((ok) => server.listen(portNo, '127.0.0.1', () => ok(server)));
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || process.argv[1].endsWith('serve.mjs')) {
  startServer().then(() => console.log(`Serving ${root} at http://127.0.0.1:${port}${base}`));
}
