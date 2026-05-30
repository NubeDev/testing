# testing

A full-stack application with a Rust backend and React frontend.

## Overview

This project consists of:

- **Backend**: A Rust web server (using Actix-web or similar) that serves on port 8080 and exposes a `/api/hello` endpoint.
- **Frontend**: A React application that calls the backend `/api/hello` endpoint and displays the response.

## Running the Backend

```bash
cd backend
cargo run
```

The backend will start and listen on `http://localhost:8080`.

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server will start (typically on `http://localhost:5173` or similar).

## Architecture

The frontend makes HTTP requests to the backend at `/api/hello`. During development, the frontend is configured to proxy API requests to `http://localhost:8080`, so calls to `/api/hello` are forwarded to the Rust backend, which returns a JSON response.
