# Food Delivery — MERN Monorepo

This repository contains three apps for a food-delivery project:

- `frontend` — customer React app (Vite)
- `admin` — admin dashboard (React + Vite)
- `backend` — Express API server (Node, MongoDB, Stripe)

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB (local or Atlas)
- Stripe account (if using payments)

## Quickstart

1. Create environment files from the provided examples (or copy manually):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp admin/.env.example admin/.env
```

Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
Copy-Item admin/.env.example admin/.env
```

2. Install dependencies and start apps (from repo root):

```bash
cd backend && npm install
npm start        # starts backend on PORT (default 4000)

# in two other terminals
cd frontend && npm install && npm run dev
cd ../admin && npm install && npm run dev
```

3. Open the apps:

- Customer app: http://localhost:5173
- Admin app: http://localhost:5174 (or next available Vite port)
- Backend API base: http://localhost:4000

## API Documentation (Swagger)

The backend exposes a Swagger UI for live API documentation. Start the backend and open:

```
http://localhost:4000/api-docs
```

Swagger will show available endpoints, request/response examples, and authentication details. The README no longer lists routes — use the Swagger UI as the source of truth.

## Environment variables

Refer to `backend/.env.example`, `frontend/.env.example`, and `admin/.env.example` for all required variables. Important backend keys include:

- `PORT` (default `4000`)
- `MONGODB_URI`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `MAX_UPLOAD_SIZE_BYTES` (default `2097152`)

## File uploads

Uploaded images are stored in `backend/uploads` and served at the `/images` static route.

## Build

To build frontend/admin for production:

```bash
cd frontend && npm run build
cd ../admin && npm run build
```

## Deployment

### Backend → Render

1. Push your repo to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com) → **New → Blueprint** → select this repo.
3. In the Render service's **Environment** tab, set these secrets:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a long random string
   - `STRIPE_SECRET_KEY` — your Stripe secret key
   - `ADMIN_SECRET_KEY` — a long random string
   - `ADMIN_PASSWORD` — your admin password
   - `FRONTEND_URL` — your deployed frontend URL (e.g. `https://feastdash.vercel.app`)
   - `ADMIN_URL` — your deployed admin URL (e.g. `https://feastdash-admin.vercel.app`)
4. Deploy. The health check at `/health` will confirm the service is running.

### Frontend & Admin → Vercel

1. Go to [Vercel](https://vercel.com) → **Add New → Project** → import this repo.
2. Set the **Root Directory** to `frontend` (or `admin` for the admin panel).
3. Vercel auto-detects Vite. Set this environment variable:
   - `VITE_API_URL` = your Render backend URL (e.g. `https://food-delivery-api.onrender.com`)
4. Deploy. The `vercel.json` rewrite rule handles SPA routing automatically.
5. Repeat for the `admin` directory as a separate Vercel project.

> **Important:** After both are deployed, update `FRONTEND_URL` and `ADMIN_URL` in Render's env vars to match the actual Vercel URLs so CORS works correctly.

