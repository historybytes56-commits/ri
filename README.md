# forrizh

```
forrizh/
├── frontend/          React (Vite)
│   └── src/
│       ├── api/         fetch wrappers for backend endpoints
│       ├── components/  reusable UI pieces
│       ├── pages/       top-level screens
│       ├── hooks/       custom hooks (data fetching, state)
│       ├── context/     React context providers
│       └── utils/       helpers
└── backend/           Node.js (Express)
    └── src/
        ├── server.js    starts the HTTP server
        ├── app.js       Express app + middleware
        ├── config/      env-based settings
        ├── routes/      URL -> controller mapping
        ├── controllers/ request/response handling
        ├── services/    business logic / data access
        ├── db/          SQLite connection (node:sqlite, file in backend/data/)
        ├── models/      table definitions
        ├── middleware/  error handling, 404, auth, etc.
        └── utils/       helpers (ApiError, ...)
```

## Running locally

```bash
# terminal 1
cd backend && npm install && npm run dev    # http://localhost:5000

# terminal 2
cd frontend && npm install && npm run dev   # http://localhost:5173
```

The Vite dev server proxies `/api/*` to the backend, so the frontend calls `/api/...` with no CORS setup needed in dev.
Backend settings live in `backend/.env` (copy from `.env.example`).

## Answers

The Yes / No answer is saved in SQLite at `backend/data/app.db`.
See saved answers at http://localhost:5000/api/answers (or `/api/answers` through the frontend dev server).
