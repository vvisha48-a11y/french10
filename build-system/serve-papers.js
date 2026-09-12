// Static server for the Phase 1 Question Papers lab.
// Serves the project root so papers-lab.html sits beside build-system/ rather
// than inside docs/, which is what GitHub Pages publishes.
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = 'C:/claude/10 th';
const MIME = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css' };
http.createServer((req, res) => {
  const p = req.url.split('?')[0];
  const f = path.join(ROOT, p === '/' ? '/papers-lab.html' : p);
  fs.readFile(f, (e, b) => {
    if (e){ res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    res.end(b);
  });
}).listen(8177, () => console.log('papers lab on http://localhost:8177'));
