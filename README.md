# 🍔 FeastDash — Full-Stack Food Delivery Application

A production-ready food delivery platform built with the **MERN** stack (MongoDB, Express, React, Node.js). Features a customer-facing ordering app, an admin dashboard for restaurant management, and a RESTful API backend with Stripe payments, JWT authentication, and Cloudinary image hosting.

---

## 🌐 Live Demo

| App | URL |
| --- | --- |
| 🛒 Customer App | <https://food-delivery-app-tan-delta.vercel.app> |
| 🔧 Admin Dashboard | <https://food-delivery-app-aa22.vercel.app> |
| ⚙️ Backend API | <https://food-delivery-app-45vo.onrender.com> |
| 📖 Swagger Docs | <https://food-delivery-app-45vo.onrender.com/api-docs> |

> **Note:** The backend is hosted on Render's free tier — the first request may take ~30 seconds to spin up.

---

## 📐 Architecture

```
food_delivery/
├── frontend/       # Customer-facing React SPA (Vite)
├── admin/          # Admin dashboard React SPA (Vite)
├── backend/        # Express REST API
│   ├── config/     # Database connection
│   ├── controllers/# Route handlers
│   ├── middlewares/ # Auth (JWT) & admin-auth middleware
│   ├── models/     # Mongoose schemas (User, Food, Order)
│   ├── routes/     # API route definitions (with Swagger JSDoc)
│   └── scripts/    # Migration utilities
└── README.md
```

---

## ✨ Features

### Customer App (`frontend`)

- 🔑 **User Authentication** — Sign up / login with JWT
- 🍕 **Browse Menu** — Explore food items by category
- 🛒 **Cart Management** — Add, remove, and adjust quantities
- 💳 **Stripe Checkout** — Secure payment processing
- 📦 **Order Tracking** — View order history and status
- 📱 **Responsive Design** — Optimized for mobile and desktop

### Admin Dashboard (`admin`)

- 🔐 **Admin Login** — Secret-key–protected authentication
- ➕ **Add Food Items** — Upload images, set name / price / category / description
- 📋 **List & Manage Items** — View, edit, or remove food items
- 📊 **Order Management** — View all orders and update delivery status
- 🔔 **Toast Notifications** — Real-time feedback via react-toastify

### Backend API (`backend`)

- 🗄️ **MongoDB + Mongoose** — Schema-first data models
- 🔒 **JWT Authentication** — Middleware-protected routes
- 💰 **Stripe Integration** — Server-side payment intents and verification
- ☁️ **Cloudinary Uploads** — Image hosting with Multer in-memory buffering
- 📖 **Swagger/OpenAPI Docs** — Auto-generated interactive API documentation
- 🛡️ **CORS Configuration** — Origin-whitelist for frontend & admin URLs
- ⚙️ **Admin Routes** — Separate admin auth middleware with secret key

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, React Router 7, Vite 7, Axios |
| Admin | React 19, React Router 7, Vite 7, Axios, react-toastify |
| Backend | Node.js 20+, Express 5, Mongoose 8, JWT, bcrypt |
| Payments | Stripe |
| Images | Cloudinary, Multer |
| Database | MongoDB (Atlas) |
| API Docs | swagger-jsdoc, swagger-ui-express |
| Deployment | Vercel (frontend/admin), Render (backend) |

---

## 📋 Prerequisites

- **Node.js** 20+ and **npm** 10+
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **Stripe** account — [dashboard.stripe.com](https://dashboard.stripe.com) (for payments)
- **Cloudinary** account — [cloudinary.com](https://cloudinary.com) (for image hosting)

---

## 🚀 Quickstart

### 1. Clone the repository

```bash
git clone https://github.com/MaulikGupta27/Food-Delivery-App.git
cd Food-Delivery-App
```

### 2. Create environment files

Copy the provided examples and fill in your credentials:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp admin/.env.example admin/.env
```

<details>
<summary>Windows PowerShell</summary>

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
Copy-Item admin/.env.example admin/.env
```

</details>

### 3. Install dependencies

```bash
# From the repo root
cd backend  && npm install
cd ../frontend && npm install
cd ../admin && npm install
```

### 4. Start the development servers

Open **three** terminals:

```bash
# Terminal 1 — Backend (http://localhost:4000)
cd backend && npm run dev

# Terminal 2 — Customer App (http://localhost:5173)
cd frontend && npm run dev

# Terminal 3 — Admin Dashboard (http://localhost:5174)
cd admin && npm run dev
```

### 5. Open in your browser

| App | URL |
| --- | --- |
| Customer App | http://localhost:5173 |
| Admin Dashboard | http://localhost:5174 |
| Backend API | http://localhost:4000 |
| Swagger Docs | http://localhost:4000/api-docs |

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Server port | `4000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/food_delivery` |
| `JWT_SECRET` | Secret key for signing JWTs | — |
| `ADMIN_SECRET_KEY` | Secret key for admin authentication | — |
| `ADMIN_PASSWORD` | Admin login password | — |
| `STRIPE_SECRET_KEY` | Stripe API secret key | — |
| `FRONTEND_URL` | Allowed CORS origin for customer app | `http://localhost:5173` |
| `ADMIN_URL` | Allowed CORS origin for admin app | `http://localhost:5174` |
| `MAX_UPLOAD_SIZE_BYTES` | Maximum image upload size | `2097152` (2 MB) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | — |
| `CLOUDINARY_API_KEY` | Cloudinary API key | — |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | — |

### Frontend & Admin (`.env`)

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:4000`) |

---

## 📖 API Documentation (Swagger)

The backend auto-generates interactive API docs via **Swagger UI**. Once the backend is running, visit:

```
http://localhost:4000/api-docs
```

All available endpoints, request/response schemas, and authentication requirements are documented there. The Swagger UI is the **single source of truth** for the API surface.

---

## ☁️ Image Uploads (Cloudinary)

Food images are uploaded to **Cloudinary** under the `food_delivery` folder. The backend uses **Multer** with in-memory storage to buffer uploads before streaming them to Cloudinary. Image URLs returned by the API are full HTTPS Cloudinary URLs.


