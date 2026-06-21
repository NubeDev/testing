// Unit tests: validate route logic in isolation using node:test + assert.
// Integration tests live in server.test.js.
const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('./server');

// ---------------------------------------------------------------------------
// Helper: in-process HTTP client
// ---------------------------------------------------------------------------
let server;
let baseUrl;

before(() => new Promise((resolve) => {
  server = http.createServer(app);
  server.listen(0, () => {
    baseUrl = `http://localhost:${server.address().port}`;
    resolve();
  });
}));

after(() => new Promise((resolve) => server.close(resolve)));

function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const payload = body !== undefined ? JSON.stringify(body) : undefined;
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };
    const r = http.request(options, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        const parsed = data.length ? JSON.parse(data) : null;
        resolve({ status: res.statusCode, headers: res.headers, body: parsed });
      });
    });
    r.on('error', reject);
    if (payload) r.write(payload);
    r.end();
  });
}

function rawReq(method, path, opts = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const r = http.request({ hostname: url.hostname, port: url.port, path: url.pathname, method, ...opts }, (res) => {
      res.resume();
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers }));
    });
    r.on('error', reject);
    r.end();
  });
}

// ---------------------------------------------------------------------------
// Unit: CORS headers
// ---------------------------------------------------------------------------
describe('CORS middleware', () => {
  test('GET /api/health sets Access-Control-Allow-Origin: *', async () => {
    const res = await rawReq('GET', '/api/health');
    assert.equal(res.headers['access-control-allow-origin'], '*');
  });

  test('OPTIONS preflight returns 204 with CORS headers', async () => {
    const res = await rawReq('OPTIONS', '/api/todos');
    assert.equal(res.status, 204);
    assert.equal(res.headers['access-control-allow-origin'], '*');
    assert.ok(res.headers['access-control-allow-methods'].includes('POST'));
    assert.ok(res.headers['access-control-allow-methods'].includes('DELETE'));
  });
});

// ---------------------------------------------------------------------------
// Unit: health endpoint
// ---------------------------------------------------------------------------
describe('GET /api/health', () => {
  test('returns 200 with status ok', async () => {
    const res = await req('GET', '/api/health');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { status: 'ok' });
  });

  test('response Content-Type is application/json', async () => {
    const res = await rawReq('GET', '/api/health');
    assert.ok(res.headers['content-type'].includes('application/json'));
  });
});

// ---------------------------------------------------------------------------
// Unit: POST /api/todos — input validation
// ---------------------------------------------------------------------------
describe('POST /api/todos — validation', () => {
  test('rejects missing body with 400', async () => {
    const res = await req('POST', '/api/todos', {});
    assert.equal(res.status, 400);
    assert.ok(res.body.error, 'error field should be present');
  });

  test('rejects null title with 400', async () => {
    const res = await req('POST', '/api/todos', { title: null });
    assert.equal(res.status, 400);
  });

  test('rejects numeric title with 400', async () => {
    const res = await req('POST', '/api/todos', { title: 42 });
    assert.equal(res.status, 400);
  });

  test('rejects boolean title with 400', async () => {
    const res = await req('POST', '/api/todos', { title: true });
    assert.equal(res.status, 400);
  });

  test('rejects empty string title with 400', async () => {
    const res = await req('POST', '/api/todos', { title: '' });
    assert.equal(res.status, 400);
  });

  test('rejects array title with 400', async () => {
    const res = await req('POST', '/api/todos', { title: ['task'] });
    assert.equal(res.status, 400);
  });
});

// ---------------------------------------------------------------------------
// Unit: POST /api/todos — successful creation
// ---------------------------------------------------------------------------
describe('POST /api/todos — creation', () => {
  test('returns 201 with id and title', async () => {
    const res = await req('POST', '/api/todos', { title: 'unit-test-todo' });
    assert.equal(res.status, 201);
    assert.equal(typeof res.body.id, 'number');
    assert.equal(res.body.title, 'unit-test-todo');
  });

  test('id is a positive integer', async () => {
    const res = await req('POST', '/api/todos', { title: 'check id' });
    assert.equal(res.status, 201);
    assert.ok(res.body.id > 0);
    assert.equal(res.body.id, Math.floor(res.body.id));
  });

  test('extra fields in body are ignored', async () => {
    const res = await req('POST', '/api/todos', { title: 'trim extra', color: 'blue', done: true });
    assert.equal(res.status, 201);
    assert.equal(res.body.title, 'trim extra');
    assert.equal(res.body.color, undefined);
  });

  test('response does not include undefined fields', async () => {
    const res = await req('POST', '/api/todos', { title: 'clean response' });
    const keys = Object.keys(res.body);
    assert.ok(keys.includes('id'));
    assert.ok(keys.includes('title'));
    assert.equal(keys.length, 2);
  });
});

// ---------------------------------------------------------------------------
// Unit: GET /api/todos
// ---------------------------------------------------------------------------
describe('GET /api/todos', () => {
  test('returns 200 and an array', async () => {
    const res = await req('GET', '/api/todos');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  test('newly created todo appears in list', async () => {
    const title = `list-test-${Date.now()}`;
    const created = await req('POST', '/api/todos', { title });
    assert.equal(created.status, 201);

    const list = await req('GET', '/api/todos');
    const found = list.body.find((t) => t.id === created.body.id);
    assert.ok(found, 'created todo must appear in GET /api/todos');
    assert.equal(found.title, title);
  });
});

// ---------------------------------------------------------------------------
// Unit: DELETE /api/todos/:id
// ---------------------------------------------------------------------------
describe('DELETE /api/todos/:id', () => {
  test('returns 404 for non-existent id', async () => {
    const res = await req('DELETE', '/api/todos/999999');
    assert.equal(res.status, 404);
    assert.ok(res.body.error);
  });

  test('returns 204 and removes the item', async () => {
    const created = await req('POST', '/api/todos', { title: 'to-delete' });
    assert.equal(created.status, 201);
    const { id } = created.body;

    const del = await rawReq('DELETE', `/api/todos/${id}`);
    assert.equal(del.status, 204);

    const list = await req('GET', '/api/todos');
    assert.ok(!list.body.find((t) => t.id === id), 'deleted todo must not appear in list');
  });

  test('double delete returns 404 on second attempt', async () => {
    const created = await req('POST', '/api/todos', { title: 'double-delete' });
    assert.equal(created.status, 201);
    const { id } = created.body;

    await rawReq('DELETE', `/api/todos/${id}`);
    const second = await req('DELETE', `/api/todos/${id}`);
    assert.equal(second.status, 404);
  });

  test('non-numeric id treated as NaN and returns 404', async () => {
    const res = await req('DELETE', '/api/todos/abc');
    assert.equal(res.status, 404);
  });
});

// ---------------------------------------------------------------------------
// Unit: unknown routes
// ---------------------------------------------------------------------------
describe('unknown routes', () => {
  test('GET /api/unknown returns 404', async () => {
    const res = await rawReq('GET', '/api/unknown');
    assert.equal(res.status, 404);
  });
});
