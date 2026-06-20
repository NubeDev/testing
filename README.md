# testing

lazybones workflow target.

## Frontend

A minimal static UI lives in `frontend/`. It talks to the Express backend at `http://localhost:3000`.

**Serve the frontend:**

```bash
# Start the backend first
cd backend && npm install && node server.js

# In another terminal — serve the static files on port 8080
cd frontend && npx serve .
# or: python3 -m http.server 8080
# then open http://localhost:8080
```

The page lists todos from `GET /api/todos`, lets you add new ones via `POST /api/todos`, and delete existing ones via `DELETE /api/todos/:id`. Each todo row has a **Delete** button.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/todos` | List all todos |
| POST | `/api/todos` | Create a todo `{ title }` → 201 |
| DELETE | `/api/todos/:id` | Remove a todo → 204, or 404 if not found |

## Tests

```bash
# Backend unit tests
cd backend && npm test

# E2e tests (requires backend running on :3000 and frontend on :8080)
cd e2e && npm test
```
