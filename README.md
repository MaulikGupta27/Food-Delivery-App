# Food Delivery — MERN Monorepo

This repository contains three apps for a food-delivery project:

- `frontend` — customer React app (Vite)
- `admin` — admin dashboard (React + Vite)
- `backend` — Express API server (Node, MongoDB, Stripe, Cloudinary)

## 🚀 Live Demo

| App | URL |
| --- | --- |
| Customer App | https://food-delivery-app-tan-delta.vercel.app |
| Admin Dashboard | https://food-delivery-app-aa22.vercel.app |
| Backend API | https://food-delivery-app-45vo.onrender.com |
| Swagger Docs | https://food-delivery-app-45vo.onrender.com/api-docs |

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB (local or Atlas)
- Stripe account (if using payments)
- Cloudinary account (for image hosting)

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
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Image uploads (Cloudinary)

Food images are uploaded to **Cloudinary** and stored under the `food_delivery` folder. The backend uses Multer with in-memory storage to buffer uploads before streaming them to Cloudinary. Image URLs returned by the API are full HTTPS Cloudinary URLs.

> **Note:** Older food items that were uploaded before the Cloudinary migration may still reference local file paths. The frontend and admin apps handle both formats gracefully — if the image URL starts with `http`, it's used directly; otherwise it falls back to the legacy `/images/<filename>` static route.

## Build

To build frontend/admin for production:

```bash
cd frontend && npm run build
cd ../admin && npm run build
```

## Deployment

### Backend → Render

1. Push your repo to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com) → **New → Web Service** → select this repo.
3. Set **Root Directory** to `backend`, **Build Command** to `npm install`, **Start Command** to `npm start`.
4. In the **Environment** tab, add:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a long random string
   - `STRIPE_SECRET_KEY` — your Stripe secret key
   - `CLOUDINARY_CLOUD_NAME` — your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` — your Cloudinary API key
   - `CLOUDINARY_API_SECRET` — your Cloudinary API secret
   - `FRONTEND_URL` — your deployed frontend URL (e.g. `https://food-delivery-app-tan-delta.vercel.app`)
   - `ADMIN_URL` — your deployed admin URL (e.g. `https://food-delivery-app-aa22.vercel.app`)
5. Deploy.

### Frontend & Admin → Vercel

1. Go to [Vercel](https://vercel.com) → **Add New → Project** → import this repo.
2. Set the **Root Directory** to `frontend` (or `admin` for the admin panel).
3. Vercel auto-detects Vite. Add this environment variable:
   - `VITE_API_URL` = your Render backend URL (e.g. `https://food-delivery-app-45vo.onrender.com`)
4. Deploy. Repeat for the `admin` directory as a separate Vercel project.

> **Important:** After both are deployed, update `FRONTEND_URL` and `ADMIN_URL` in Render's env vars to match the actual Vercel URLs so CORS works correctly.
