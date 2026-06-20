const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('./server');

let server;
let baseUrl;

before(() => new Promise((resolve) => {
  server = http.createServer(app);
  server.listen(0, () => {
    baseUrl = `http://localhost:${server.address().port}`;
    resolve();
  });
}));

after(() => new Promise((resolve) => {
  server.close(resolve);
}));

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, body: JSON.parse(data) });
      });
    });
    req.on('error', reject);
    if (body !== undefined) req.write(JSON.stringify(body));
    req.end();
  });
}

test('GET /api/health returns { status: "ok" }', async () => {
  const res = await request('GET', '/api/health');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { status: 'ok' });
});

test('GET /api/todos returns an array', async () => {
  const res = await request('GET', '/api/todos');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
});

test('POST /api/todos creates a todo and GET returns it', async () => {
  const post = await request('POST', '/api/todos', { title: 'Buy milk' });
  assert.equal(post.status, 201);
  assert.equal(post.body.title, 'Buy milk');
  assert.ok(typeof post.body.id === 'number');

  const get = await request('GET', '/api/todos');
  assert.equal(get.status, 200);
  const found = get.body.find((t) => t.id === post.body.id);
  assert.ok(found, 'created todo should appear in list');
  assert.equal(found.title, 'Buy milk');
});

test('POST /api/todos with missing title returns 400', async () => {
  const res = await request('POST', '/api/todos', {});
  assert.equal(res.status, 400);
  assert.ok(res.body.error);
});
