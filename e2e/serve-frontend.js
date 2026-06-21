const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.FRONTEND_PORT || 8080;
const FRONTEND_DIR = path.join(__dirname, '../frontend');
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' };

const server = http.createServer((req, res) => {
  const rel = req.url === '/' ? 'index.html' : req.url.slice(1);
  const filePath = path.join(FRONTEND_DIR, rel);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'text/plain' });
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`Frontend serving on http://localhost:${PORT}`));
