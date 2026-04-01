# Zorvyn Backend Assignment

Backend API for financial record management with authentication, role-based authorization, dashboard analytics, and user management.

## Tech Stack

- Node.js + TypeScript
- Express
- Prisma ORM
- SQLite (via `@prisma/adapter-better-sqlite3`)
- Zod validation
- JWT auth

## Setup

### 1. Installation Steps

```bash
npm install
```

### 2. Environment Variables

Create `.env` from `.env.example` and update values as needed.

```bash
cp .env.example .env
```

### 3. Migration Steps

Apply Prisma migrations:

```bash
npx prisma migrate dev
```

If you want Prisma client generation explicitly:

```bash
npx prisma generate
```

### 4. Seed Steps

Run seed data:

```bash
npx prisma db seed
```

The seed adds sample users and financial records.

### 5. Run the Server

Development:

```bash
npm run dev
```

Production build + run:

```bash
npm run start
```

## Environment Variables

See `.env.example` for the template.

Required keys:

- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`

## Architecture

The project follows a layered architecture:

```text
Route -> Controller -> Service -> Repository -> DB
```

- Route: endpoint definitions, middleware chaining (auth, role, validation).
- Controller: request/response orchestration and HTTP status handling.
- Service: business rules and use-case logic.
- Repository: Prisma query layer.
- DB: SQLite database accessed via Prisma.

## Role Matrix

| Endpoint | ADMIN | ANALYST | USER | Unauthenticated |
|---|---:|---:|---:|---:|
| `POST /auth/register` | ✅ | ✅ | ✅ | ✅ |
| `POST /auth/login` | ✅ | ✅ | ✅ | ✅ |
| `POST /records` | ✅ | ❌ | ❌ | ❌ |
| `GET /records` | ✅ | ✅ | ❌ | ❌ |
| `GET /records/:id` | ✅ | ✅ | ❌ | ❌ |
| `PATCH /records/:id` | ✅ | ❌ | ❌ | ❌ |
| `DELETE /records/:id` | ✅ | ❌ | ❌ | ❌ |
| `GET /dashboard/summary` | ✅ | ✅ | ❌ | ❌ |
| `GET /dashboard/by-category` | ✅ | ✅ | ❌ | ❌ |
| `GET /dashboard/monthly-trends` | ✅ | ✅ | ❌ | ❌ |
| `GET /dashboard/recent` | ✅ | ✅ | ❌ | ❌ |
| `GET /users` | ✅ | ❌ | ❌ | ❌ |
| `PATCH /users/:id/role` | ✅ | ❌ | ❌ | ❌ |
| `PATCH /users/:id/status` | ✅ | ❌ | ❌ | ❌ |

## Assumptions

- Single currency is used across all records.
- No multi-tenant boundaries are implemented.
- Categories are stored as free-text.

## Tradeoffs

- SQLite is used for simplicity and fast local setup.
- No refresh-token flow (access token only).

## Future Improvements

- Unit testing setup (Jest) for controllers/services.
- Redis caching for dashboard-heavy reads.
- Docker setup for local/dev/prod consistency.
