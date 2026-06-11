# HR Management System

A full-stack HR Management application built with a Node.js/Express backend and a React frontend. It allows HR Managers to manage employee records, view workforce analytics, and access real-time insights.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Employees](#employees)
  - [Insights](#insights)
- [Database](#database)
- [Caching](#caching)
- [Authentication & Authorization](#authentication--authorization)

---

## Features

- **Employee Management** — Create, read, update, and soft-delete employee records
- **Search & Filter** — Filter employees by country, department; full-text search; paginated results
- **HR Insights Dashboard** — Country-level breakdowns, job title distributions, age demographics, and new hire tracking
- **JWT Authentication** — Cookie-based auth with session expiry handling
- **Role-Based Access** — Only users with the `HR Manager` job title can access protected routes
- **Redis Caching** — Country insights are cached in Redis to reduce database load
- **Rate Limiting & CORS** — Configurable middleware for production-ready security

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express 5 |
| ORM | Prisma |
| Database | SQLite (via Prisma) |
| Cache | Redis (ioredis) |
| Auth | JWT + bcrypt |
| Validation | Zod + express-validator |
| Security | Helmet, CORS middleware, Rate Limiter |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Animations | Motion |
| Icons | Lucide React |
| AI Integration | Google Generative AI SDK |

---

## Project Structure

```
HR_P_Sy/
├── backend/
│   ├── config/
│   │   └── redis.js              # Redis singleton client
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   ├── seed.js               # Database seeder
│   │   └── migrations/           # Prisma migration history
│   └── src/
│       ├── controllers/
│       │   ├── employee.controller.js
│       │   └── insights.controller.js
│       ├── services/
│       │   ├── employee.service.js
│       │   └── insight.services.js
│       ├── routes/
│       │   ├── employee.routes.js
│       │   └── insight.routes.js
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   ├── corsMiddleware.js
│       │   ├── errorMiddleware.js
│       │   └── rateLimiter.js
│       ├── validators/
│       │   └── employeeValidator.js
│       ├── utils/
│       │   ├── cache.js           # Redis get/set/invalidate helpers
│       │   └── error.js           # Custom error classes
│       ├── lib/
│       │   └── prisma.js          # Prisma client instance
│       ├── enum/
│       │   └── index.js           # Role enums (e.g. HR_MANAGER)
│       └── server.js              # Express app entry point
│
└── frontend/
    └── HR_Management/
        └── src/
            ├── components/
            │   ├── EmployeeTable.jsx
            │   ├── EmployeeModal.jsx
            │   ├── InsightsDashboard.jsx
            │   ├── MatricCard.jsx
            │   └── LoginScreen.jsx
            ├── App.jsx
            └── main.jsx
```

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Redis** running locally (default: `redis://localhost:6379`)

---

## Getting Started

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Copy and configure environment variables
cp .env.example .env
# Edit .env with your settings (see Environment Variables section)

# 4. Run database migrations
npx prisma migrate dev

# 5. (Optional) Seed the database with sample data
node prisma/seed.js

# 6. Start the development server
npm run dev
```

The backend will start on **http://localhost:4000** by default.

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend/HR_Management

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

The frontend will start on **http://localhost:5173** by default.

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Path to the SQLite database file
DATABASE_URL="file:./prisma/dev.db"

# Port for the Express server
PORT=4000

# Secret key for signing JWT tokens — change this to a strong random string in production
JWT_SECRET="your_strong_secret_here"

# Redis connection URL
REDIS_URL="redis://localhost:6379"
```

---

## API Reference

All protected routes require a valid JWT token stored in an `accessToken` HTTP-only cookie, issued upon login.

### Authentication

#### Login
```
POST /api/employees/login
```
**Body:**
```json
{
  "email": "hr@example.com",
  "password": "your_password"
}
```
**Response:** Sets an `accessToken` cookie valid for 24 hours.

---

### Employees

All routes below require authentication. Only users with the `HR Manager` job title are authorized.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/employees` | Create a new employee |
| `GET` | `/api/employees` | List employees (paginated, filterable) |
| `GET` | `/api/employees/:id` | Get a single employee by ID |
| `PATCH` | `/api/employees/:id` | Update employee details |
| `DELETE` | `/api/employees/:id` | Soft-delete an employee |

**Query parameters for `GET /api/employees`:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Results per page |
| `search` | string | — | Search by name or email |
| `country` | string | — | Filter by country |
| `department` | string | — | Filter by department |
| `sortBy` | string | `id` | Field to sort by |
| `sortOrder` | string | `desc` | `asc` or `desc` |

**Updatable fields via `PATCH`:** `fullName`, `email`, `department`, `jobTitle`, `age`, `salary`

---

### Insights

All routes require authentication.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/insight/country/:country` | Workforce stats for a specific country (cached) |
| `GET` | `/api/insight/jobtitle?jobTitle=<title>` | Stats for a specific job title |
| `GET` | `/api/insight/age-distribution` | Age bracket breakdown across all employees |
| `GET` | `/api/insight/new-hires` | Count of employees hired in the current month |

---

## Database

The app uses **SQLite** managed via **Prisma ORM**.

### Employee Model

| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `employeeCode` | String | Unique identifier |
| `fullName` | String | |
| `email` | String | Unique |
| `password` | String? | Hashed with bcrypt |
| `country` | String | |
| `department` | String | |
| `jobTitle` | String | |
| `salary` | Float | |
| `currency` | String | |
| `age` | Int | |
| `isDeleted` | Boolean | Soft-delete flag |
| `startDate` | String | |
| `createdAt` | DateTime | Auto-set |
| `updatedAt` | DateTime | Auto-updated |

Indexes are set on `(department, isDeleted)` and `(country, isDeleted)` for query performance.

To generate the Prisma client after schema changes:
```bash
npx prisma generate
```

---

## Caching

Country-level insights are cached in **Redis** using a singleton `RedisClient`. The cache is automatically invalidated when a new employee is created in that country. The cache utility (`src/utils/cache.js`) exposes `get`, `set`, and `invalidate` helpers.

Redis is optional for development — if unavailable, the application falls back to fetching directly from the database.

---

## Authentication & Authorization

- On login, a signed **JWT** is issued and stored as an HTTP-only cookie (`accessToken`, 1-day expiry).
- Every protected route runs the `authenticate` middleware, which verifies the token and checks that the user exists and is not soft-deleted.
- **Role check:** Only employees whose `jobTitle` matches the `HR_MANAGER` enum value can access any protected API route.
