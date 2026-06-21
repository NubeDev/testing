# Backend API

Minimal Node.js + Express HTTP API.

## Endpoints

- `GET /api/health` — returns `{"status":"ok"}`
- `GET /api/todos` — returns the in-memory todos array
- `POST /api/todos` — body `{"title":"..."}` appends a todo and returns it

## Run

```bash
npm install && npm start
```

Server starts on port 3000 (override with `PORT` env var).
