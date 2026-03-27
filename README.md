# Food Delivery MERN Monorepo

MERN food delivery project with three applications in one repository:

- `frontend`: customer app (React + Vite)
- `admin`: admin dashboard (React + Vite)
- `backend`: API server (Express + MongoDB + Stripe)

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB instance (local or Atlas)
- Stripe account (for checkout)

## Project Structure

```text
food_delivery/
	backend/
	frontend/
	admin/
```

## 1) Configure Environment Variables

Create environment files from examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp admin/.env.example admin/.env
```

If you are on Windows PowerShell, use:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
Copy-Item admin/.env.example admin/.env
```

### Backend (`backend/.env`)

- `PORT` (default `4000`)
- `MONGODB_URI`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `FRONTEND_URL` (default `http://localhost:5173`)
- `ADMIN_SECRET_KEY`
- `ADMIN_PASSWORD`
- `MAX_UPLOAD_SIZE_BYTES` (default `2097152`)

### Frontend (`frontend/.env`)

- `VITE_API_URL` (default `http://localhost:4000`)

### Admin (`admin/.env`)

- `VITE_API_URL` (default `http://localhost:4000`)

## 2) Install Dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install
```

## 3) Run in Development

Open three terminals.

Terminal 1 (backend):

```bash
cd backend
npm start
```

Terminal 2 (frontend):

```bash
cd frontend
npm run dev
```

Terminal 3 (admin):

```bash
cd admin
npm run dev
```

## 4) Build Frontend Apps

```bash
cd frontend && npm run build
cd ../admin && npm run build
```

## App URLs (Default)

- Frontend: `http://localhost:5173`
- Admin: `http://localhost:5174` (or next available Vite port)
- Backend API: `http://localhost:4000`

## API Overview

Base routes exposed by backend:

- `GET /` -> API status message
- `POST /api/user/register`
- `POST /api/user/login`
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `POST /api/food/add`
- `GET /api/food/list`
- `POST /api/food/remove`
- `POST /api/cart/add`
- `POST /api/cart/remove`
- `POST /api/cart/get`
- `POST /api/order/place`
- `GET /api/order/verify`
- `POST /api/order/verify`
- `POST /api/order/userorders`
- `GET /api/order/list`
- `POST /api/order/status`

## Notes

- Uploaded images are served from `backend/uploads` via `/images`.
- Keep real secrets out of version control and only commit `.env.example`.
