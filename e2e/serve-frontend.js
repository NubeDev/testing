const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const ROOT = path.resolve(__dirname, '../frontend');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
};

http.createServer((req, res) => {
  const urlPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(ROOT, urlPath);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Frontend server on port ${PORT}`);
});
