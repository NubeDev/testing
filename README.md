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

The page lists todos from `GET /api/todos` and lets you add new ones via `POST /api/todos`.
