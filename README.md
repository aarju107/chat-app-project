# Chatly

A small real-time one-to-one chat app built with React, Express, Socket.IO, and MongoDB.

## Run locally

The backend expects `backend/.env` with `PORT`, `MONGO_URI`, and `JWT_SECRET_KEY`. The existing project is configured to use port `8000`.

Open two terminals:

```powershell
cd backend
npm start
```

```powershell
cd frontend
npm start
```

Then open [http://localhost:3000](http://localhost:3000). Create two accounts and sign in to each in a different browser/private window to test live chat.

Optional settings:

- `CLIENT_URL` in `backend/.env` can contain comma-separated allowed frontend origins.
- `REACT_APP_API_URL` in `frontend/.env.local` can override the default API URL (`http://localhost:8000`).
