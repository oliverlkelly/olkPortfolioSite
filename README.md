# Portfolio — Full-Stack

A production-grade portfolio website built with **React**, **TypeScript**, **Node.js**, and **PostgreSQL**. Features a dark editorial design, animated sections, an admin CMS, and a contact form.

```
portfolio/
├── backend/          Express + TypeScript API
│   ├── src/
│   │   ├── db/           PostgreSQL pool + schema migrations
│   │   ├── middleware/   Rate limiter, auth (HMAC tokens)
│   │   └── routes/       projects · experience · education · profile · contact · admin
│   └── Dockerfile
│
├── frontend/         React + Vite + TypeScript SPA
│   ├── src/
│   │   ├── components/   Hero · Nav · Projects · Experience · Education
│   │   │                 Stats · Footer · ContactForm · ProjectModal
│   │   │                 CustomCursor · ScrollProgress · Skeleton
│   │   ├── pages/        AdminPanel (full CRUD)
│   │   ├── hooks/        usePortfolioData · useAdmin
│   │   └── styles/       global.css (design tokens, animations)
│   ├── nginx.conf        Production serving + /api proxy
│   └── Dockerfile
│
├── docker-compose.yml       Production (Postgres + API + Nginx)
├── docker-compose.dev.yml   Dev overlay (hot-reload volumes)
└── package.json             Root scripts (concurrently)
```

---

## Quick start

### Option A — Docker (recommended)

```bash
git clone <your-repo-url> portfolio
cd portfolio

# Start everything (Postgres + API + frontend)
docker compose up --build
```

The site is at **http://localhost:5173** and the API at **http://localhost:3001**.

### Option B — Local dev

**Prerequisites:** Node ≥ 20, PostgreSQL ≥ 14

```bash
# 1. Install all dependencies
npm run install:all

# 2. Start Postgres (Docker makes this easy)
docker compose up postgres -d

# 3. Copy and edit env files
cp backend/.env.example backend/.env
# Edit backend/.env — at minimum set DATABASE_URL

# 4. Run migrations + seed data
npm run db:migrate

# 5. Start both servers with hot-reload
npm run dev
```

- Frontend: http://localhost:5173
- API:      http://localhost:3001
- Admin:    http://localhost:5173/admin

---

## Environment variables

Copy `backend/.env.example` to `backend/.env`:

| Variable           | Default                   | Description                              |
|--------------------|---------------------------|------------------------------------------|
| `DATABASE_URL`     | `postgresql://...`        | PostgreSQL connection string             |
| `PORT`             | `3001`                    | API server port                          |
| `FRONTEND_URL`     | `http://localhost:5173`   | CORS allowed origin                      |
| `ADMIN_PASSWORD`   | `portfolio-admin`         | Password for `/admin` login              |
| `ADMIN_SECRET`     | `super-secret-...`        | HMAC signing key for admin tokens        |
| `RESEND_API_KEY`   | —                         | (Optional) Resend API key for emails     |
| `CONTACT_EMAIL`    | —                         | (Optional) Where contact form sends to   |

> **Important:** Change `ADMIN_PASSWORD` and `ADMIN_SECRET` before any public deployment.

---

## Admin panel

Navigate to **/admin** to manage your portfolio content without touching the database.

- **Login** with your `ADMIN_PASSWORD`
- **Projects** — create, edit, delete, reorder, toggle featured
- **Experience** — add roles with achievements and tech stack
- **Education** — add degrees and certifications
- Sessions last 8 hours and are stored in `sessionStorage`

---

## API reference

All public endpoints return `{ data: T }`.

| Method | Endpoint                    | Description                |
|--------|-----------------------------|----------------------------|
| GET    | `/api/profile`              | Owner profile              |
| GET    | `/api/projects`             | All projects               |
| GET    | `/api/projects/featured`    | Featured projects only     |
| GET    | `/api/projects/:id`         | Single project             |
| GET    | `/api/experience`           | All experience             |
| GET    | `/api/experience/:id`       | Single experience          |
| GET    | `/api/education`            | All education              |
| POST   | `/api/contact`              | Send contact message       |
| POST   | `/api/admin/login`          | Get admin token            |
| PUT    | `/api/admin/profile`        | Update profile 🔒          |
| CRUD   | `/api/admin/projects`       | Manage projects 🔒         |
| CRUD   | `/api/admin/experience`     | Manage experience 🔒       |
| CRUD   | `/api/admin/education`      | Manage education 🔒        |

🔒 = requires `Authorization: Bearer <token>` header

---

## Personalising

### 1. Update seed data

Edit `backend/src/db/schema.sql` — find the `INSERT INTO profile`, `projects`, `experience`, and `education` blocks and replace the placeholder data with your own.

Then re-run the migration:

```bash
npm run db:migrate
```

Or use the admin panel at `/admin` to edit everything through the UI.

### 2. Change the colour scheme

Open `frontend/src/styles/global.css` and edit the CSS variables:

```css
:root {
  --bg:     #0a0a0a;   /* page background       */
  --accent: #e8ff47;   /* acid yellow highlights */
  --text:   #f0ede6;   /* primary text           */
}
```

### 3. Change fonts

Update the Google Fonts link in `frontend/index.html` and the `--font-*` variables in `global.css`.

### 4. Wire up a real email service

In `backend/src/routes/contact.ts`, replace the `console.log` block:

```ts
// Using Resend (npm install resend)
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: 'portfolio@yourdomain.com',
  to:   process.env.CONTACT_EMAIL!,
  subject: `Portfolio contact from ${name}`,
  text:    `Name: ${name}\nEmail: ${email}\n\n${message}`,
});
```

---

## Deployment

### Frontend

Build the static bundle and serve with any CDN or hosting provider:

```bash
cd frontend && npm run build   # outputs to frontend/dist/
```

Recommended hosts: **Vercel**, **Netlify**, **Cloudflare Pages** (set `VITE_API_URL` to your API URL).

### Backend

Deploy the Node.js server to any platform that runs containers:

```bash
cd backend && npm run build    # outputs to backend/dist/
```

Recommended: **Railway**, **Render**, **Fly.io**, **AWS ECS**.

### Full Docker deployment

```bash
# Build production images
docker compose build

# Run with env file
docker compose --env-file backend/.env up -d
```

---

## Tech stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | React 18, TypeScript, Vite, CSS Modules     |
| Backend    | Node.js, Express, TypeScript                |
| Database   | PostgreSQL 16 with `uuid-ossp` extension    |
| Auth       | HMAC-SHA256 signed tokens (no dependencies) |
| Fonts      | Playfair Display, JetBrains Mono, Outfit    |
| DevOps     | Docker, Docker Compose, Nginx               |
| Deployment | Any OCI-compatible container runtime        |

---

## Scripts

Run from the **root** of the monorepo:

| Script               | Description                                     |
|----------------------|-------------------------------------------------|
| `npm run dev`        | Start both servers with hot-reload (concurrently) |
| `npm run install:all`| Install deps for both backend and frontend      |
| `npm run build`      | Production build both packages                  |
| `npm run db:migrate` | Run schema.sql against `DATABASE_URL`           |
| `npm run docker:up`  | Build and start all Docker services             |
| `npm run docker:db`  | Start only Postgres in Docker                   |
| `npm run docker:down`| Stop all Docker services                        |
| `npm run docker:logs`| Tail all container logs                         |

---

## License

MIT — use this as a starting point for your own portfolio.
