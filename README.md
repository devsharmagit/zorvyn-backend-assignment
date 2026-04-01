# Finance Data Processing and Access Control Backend

This project is a backend implementation for the internship assignment:

- User and role management
- Financial records CRUD with filtering
- Dashboard summary analytics
- Role-based access control
- Validation and consistent error handling
- Data persistence

## Primary Stack

- Node.js + TypeScript
- Express.js
- Prisma ORM
- SQLite (via @prisma/adapter-better-sqlite3)
- Zod (request validation)
- JWT + bcryptjs (authentication)

## Assignment Requirement Coverage

### 1. User and Role Management

Implemented:

- User registration and login
- Role model: USER, ANALYST, ADMIN
- User status management: active/inactive
- Admin-only user management APIs

Endpoints:

- POST /auth/register
- POST /auth/login
- GET /users (ADMIN)
- PATCH /users/:id/role (ADMIN)
- PATCH /users/:id/status (ADMIN)

Behavior notes:

- Inactive users cannot log in.
- If a user becomes inactive after token issuance, protected endpoints reject access.

### 2. Financial Records Management

Implemented:

- Create, list, get by id, update, delete (soft delete)
- Record fields: amount, type (INCOME/EXPENSE), category, date, notes
- Filters: type, category, date range
- Pagination + sorting on list endpoint

Endpoints:

- POST /records (ADMIN)
- GET /records (ADMIN, ANALYST)
- GET /records/:id (ADMIN, ANALYST)
- PATCH /records/:id (ADMIN)
- DELETE /records/:id (ADMIN)

### 3. Dashboard Summary APIs

Implemented:

- Total income
- Total expenses
- Net balance
- Category-wise totals (income/expense/net per category)
- Monthly trends (last 6 months)
- Recent activity (latest records)

Endpoints:

- GET /dashboard/summary (ADMIN, ANALYST)
- GET /dashboard/by-category (ADMIN, ANALYST)
- GET /dashboard/monthly-trends (ADMIN, ANALYST)
- GET /dashboard/recent (ADMIN, ANALYST)

### 4. Access Control Logic

Implemented with middleware:

- authenticate: validates JWT and user active status
- authorize: enforces role-based policy per endpoint

Role behavior summary:

- USER: auth-only, no records/dashboard management APIs
- ANALYST: read records and dashboard insights
- ADMIN: full records + user management

### 5. Validation and Error Handling

Implemented:

- Zod-based validation for body/query/params
- Standardized error response format with error codes
- Appropriate HTTP status codes for auth, validation, not found, forbidden, conflict

### 6. Data Persistence

Implemented:

- SQLite database with Prisma schema/migrations
- Seed script for sample users and records
- Soft delete for financial records

## Architecture

Layered backend architecture:

Route -> Controller -> Service -> Repository -> Database

- Routes: endpoint registration and middleware composition
- Controllers: request/response orchestration
- Services: business logic and calculations
- Repositories: data access via Prisma

## API Access Matrix

| Endpoint | ADMIN | ANALYST | USER | Public |
|---|---:|---:|---:|---:|
| POST /auth/register | ✅ | ✅ | ✅ | ✅ |
| POST /auth/login | ✅ | ✅ | ✅ | ✅ |
| POST /records | ✅ | ❌ | ❌ | ❌ |
| GET /records | ✅ | ✅ | ❌ | ❌ |
| GET /records/:id | ✅ | ✅ | ❌ | ❌ |
| PATCH /records/:id | ✅ | ❌ | ❌ | ❌ |
| DELETE /records/:id | ✅ | ❌ | ❌ | ❌ |
| GET /dashboard/summary | ✅ | ✅ | ❌ | ❌ |
| GET /dashboard/by-category | ✅ | ✅ | ❌ | ❌ |
| GET /dashboard/monthly-trends | ✅ | ✅ | ❌ | ❌ |
| GET /dashboard/recent | ✅ | ✅ | ❌ | ❌ |
| GET /users | ✅ | ❌ | ❌ | ❌ |
| PATCH /users/:id/role | ✅ | ❌ | ❌ | ❌ |
| PATCH /users/:id/status | ✅ | ❌ | ❌ | ❌ |

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Configure environment

```bash
cp .env.example .env
```

Required variables:

- PORT
- DATABASE_URL
- JWT_SECRET

3. Run migrations and generate client

```bash
npx prisma migrate dev
npx prisma generate
```

4. Seed sample data

```bash
npx prisma db seed
```

5. Start server

```bash
npm run dev
```

Health check:

- GET /health

## Sample Record Filter Query

GET /records?type=INCOME&category=Salary&startDate=2026-01-01&endDate=2026-03-31&page=1&limit=10&sortBy=date&order=desc

## Technical Decisions and Trade-offs

- Express + TypeScript: lightweight API development with strong typing and clear code readability for faster review.
- Prisma + SQLite: quick local setup with explicit schema and migrations, making functionality easier to verify during review.
- JWT stateless auth: straightforward authentication flow that is easy to test and review.
- Soft delete on records: preserves historical data while hiding deleted items, so behavior can be reviewed without data loss.
- Layered architecture: keeps business logic separate from transport and persistence, improving maintainability and reviewer navigation.

Trade-offs:

- SQLite is ideal for local/demo usage but not horizontally scalable like production-grade DB setups.
- Access token only (no refresh token or revocation list).
- No automated unit/integration test suite included.

## Assumptions

- Single currency context.
- No multi-tenant segregation.
- Categories are free-text values.

## Optional Enhancements Implemented

- Token-based authentication
- Pagination and sorting for record listing
- Soft delete for records

## Known Improvements (Future Scope)

- Add automated tests (unit + integration)
- Add API docs export (OpenAPI/Swagger or Postman collection)
- Add refresh token flow and logout invalidation
- Add search endpoint and rate limiting

## Submission Notes (Form-Friendly)

- Primary Framework or Library Used: Node.js (Express)
- Features Implemented:
	- User and Role Management
	- Financial Records CRUD
	- Record Filtering (date/category/type)
	- Dashboard Summary APIs
	- Role-Based Access Control
	- Input Validation and Error Handling
	- Data Persistence (SQLite)
