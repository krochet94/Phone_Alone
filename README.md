# PhoneAlone E-commerce (MERN)

Buy smartphone online app built with Node.js, Express, MongoDB (Mongoose), React, Redux, and Stripe.

## What was updated

This project was modernized for better reliability and Vercel deployment support:

- Updated root/backend and frontend dependencies to newer compatible versions
- Replaced deprecated backend usage (`remove`, `useFindAndModify`, legacy bcrypt import path)
- Improved env loading and added `backend/config/config.env.example`
- Added safer cookie behavior for production (`secure`, `sameSite`)
- Added Vercel serverless API entrypoint (`api/index.js`)
- Updated `vercel.json` for fullstack routing (`/api/*` to backend, SPA fallback to frontend)
- Added GitHub Actions CI workflow (`.github/workflows/ci.yml`)
- Fixed frontend payment error clearing bug

---

## Requirements

- Node.js 20.x
- npm 10.x

---

## Local development

### 1) Install dependencies

From repository root:

```bash
npm install
npm run install:frontend
```

### 2) Configure env

Create this file:

`backend/config/config.env`

You can copy from:

`backend/config/config.env.example`

Minimum required values:

- `DB_URI`
- `DB_LOCAL_URI`
- `JWT_SECRET`
- `JWT_EXPIRATION`
- `COOKIE_EXPIRATION`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY` (or legacy `STRIPE_API_KEY`)
- `FRONTEND_URL`

If you use forgot-password email:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_EMAIL`
- `SMTP_PASSWORD`
- `SMTP_FROM_NAME`
- `SMTP_FROM_EMAIL`

### 3) Run app

Run backend and frontend in separate terminals:

Terminal 1 (from repo root):

```bash
npm run dev
```

Terminal 2 (frontend dev server):

```bash
npm --prefix frontend run dev
```

- Backend: `http://127.0.0.1:4000`
- Frontend (Vite): `http://127.0.0.1:5173`

> If you see `EADDRINUSE: address already in use :::4000`, another backend process is already running.
>
> On Windows, find and stop it:
>
> ```bash
> netstat -ano | findstr :4000
> taskkill /PID <PID> /F
> ```

> `npm run dev` uses `DB_LOCAL_URI` by default in development.

To run development against Atlas instead:

```bash
npm run dev:atlas
```

### 4) Seed database (optional)

```bash
npm run seeder
```

> `npm run seeder` uses `DB_LOCAL_URI` by default.

To seed Atlas directly:

```bash
npm run seeder:atlas
```

---

## Deploy to Vercel (recommended flow)

### 1) Push repository to GitHub

### 2) Import project in Vercel

- Framework preset: **Other** (vercel.json is used)
- Root directory: repository root

### 3) Set Vercel Environment Variables

Set all backend vars in Vercel Project Settings → Environment Variables:

- `NODE_ENV=production`
- `DB_URI`
- `JWT_SECRET`
- `JWT_EXPIRATION`
- `COOKIE_EXPIRATION`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY` (or legacy `STRIPE_API_KEY`)
- `FRONTEND_URL=https://<your-vercel-domain>`
- SMTP vars (if email features are used)

### 4) Deploy

Vercel will:

- Build frontend using `frontend/package.json`
- Serve backend from `api/index.js`
- Route `/api/*` to Express app
- Route non-API requests to frontend SPA

### 5) Post-deploy checks

- `https://<your-domain>/api/health`
- Register/login flow
- Protected routes
- Stripe key endpoint `/api/v1/apikey`

---

## CI/CD

CI workflow is added at:

`.github/workflows/ci.yml`

It runs on push/PR to `main` and `master`:

1. install root dependencies
2. install frontend dependencies
3. backend load check (`npm run check:backend`)
4. frontend production build (`npm run build:frontend`)

Recommended deployment model:

- Keep Vercel Git Integration for automatic deploys
- Use GitHub Actions CI as quality gate before merge

---

## Free, Vercel-friendly data/storage services

For your current architecture, best free stack is:

1. **MongoDB Atlas (M0 Free Tier)**
   - Directly compatible with Mongoose models
   - Easiest migration path (no rewrite needed)

2. **Cloudinary Free Tier**
   - Already integrated for product/user images

3. **Email (free options)**
   - Brevo free tier or Resend free tier

4. **Optional cache/session/rate-limit store**
   - Upstash Redis free tier (Vercel friendly)

### Suggested backend next steps (optional but recommended)

- Add request rate limiting + brute-force protection for auth endpoints
- Add input validation layer (e.g., Zod/Joi)
- Add structured logging for production error tracing

---

## Scripts

Root scripts:

- `npm run dev` – run backend in development mode
- `npm run dev:atlas` – run backend in development mode using Atlas DB
- `npm run prod` – run backend in production mode locally
- `npm run seeder` – seed products into local DB
- `npm run seeder:atlas` – seed products into Atlas DB
- `npm run install:frontend` – install frontend deps
- `npm run build:frontend` – build CRA frontend
- `npm run check:backend` – lightweight backend load check
- `npm run ci:check` – backend check + frontend build
