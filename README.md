# FinDash — Finance Data Processing & Access Control System

A full-stack MERN application with RBAC, financial record management, MongoDB aggregation analytics, and a modern React dashboard.

## 🏗️ Tech Stack

| Layer     | Technology           |
|-----------|---------------------|
| Frontend  | React 19, Vite, Tailwind CSS, Recharts, Lucide Icons |
| Backend   | Node.js, Express.js  |
| Database  | MongoDB, Mongoose ODM |
| Auth      | JWT (access + refresh tokens), bcrypt |

## 📦 Project Structure

```
backend/
├── config/          # DB connection
├── controllers/     # HTTP handlers
├── middlewares/     # Auth, validation, error handler
├── models/          # Mongoose schemas
├── repositories/    # Data access layer
├── routes/          # Express routers
├── services/        # Business logic
└── utils/           # Logger, API response, validation schemas

frontend/
├── src/
│   ├── components/  # Navbar, Layout, Toast, ProtectedRoute
│   ├── context/     # AuthContext (Context API)
│   ├── pages/       # Login, Register, Dashboard, Transactions, AdminPanel
│   └── services/    # Axios API layer with JWT interceptor
```

## 🔐 Role Permissions

| Permission             | Viewer | Analyst | Admin |
|------------------------|--------|---------|-------|
| View records           | ✅     | ✅      | ✅    |
| Create/edit records    | ❌     | ✅      | ✅    |
| Delete records         | ❌     | ❌      | ✅    |
| View dashboard/analytics | ❌   | ✅      | ✅    |
| Manage users           | ❌     | ❌      | ✅    |

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
npm install

# Configure environment
# Edit .env with your MONGO_URI, JWT secrets, etc.

npm run dev    # Starts on port 5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev    # Starts on port 5173
```

### Environment Variables

**Backend (`.env`)**
| Variable            | Default                                    |
|---------------------|--------------------------------------------|
| PORT                | 5000                                       |
| MONGO_URI           | mongodb://localhost:27017/finance_dashboard |
| JWT_SECRET          | (change for production)                    |
| JWT_REFRESH_SECRET  | (change for production)                    |
| CLIENT_URL          | http://localhost:5173                       |

**Frontend (`.env`)**
| Variable           | Default                       |
|--------------------|-------------------------------|
| VITE_API_BASE_URL  | http://localhost:5000/api      |

## 📘 API Documentation

### Auth
| Method | Endpoint             | Access | Description        |
|--------|----------------------|--------|--------------------|
| POST   | /api/auth/register   | Public | Register new user  |
| POST   | /api/auth/login      | Public | Login              |
| POST   | /api/auth/refresh    | Public | Refresh JWT token  |
| GET    | /api/auth/profile    | Auth   | Get current user   |

### Financial Records
| Method | Endpoint                | Access         | Description              |
|--------|-------------------------|----------------|--------------------------|
| GET    | /api/records            | All Auth       | List (paginated, filtered) |
| GET    | /api/records/categories | All Auth       | Get unique categories    |
| GET    | /api/records/:id        | All Auth       | Get single record        |
| POST   | /api/records            | Analyst, Admin | Create record            |
| PUT    | /api/records/:id        | Analyst, Admin | Update record            |
| DELETE | /api/records/:id        | Admin          | Soft delete              |

### Dashboard Analytics
| Method | Endpoint                         | Access          | Description             |
|--------|----------------------------------|-----------------|-------------------------|
| GET    | /api/dashboard/summary           | Analyst, Admin  | Income/expense/balance  |
| GET    | /api/dashboard/category-breakdown| Analyst, Admin  | Per-category totals     |
| GET    | /api/dashboard/trends?period=    | Analyst, Admin  | Monthly/weekly trends   |
| GET    | /api/dashboard/recent-activity   | Analyst, Admin  | Latest transactions     |

### User Management
| Method | Endpoint                    | Access | Description        |
|--------|-----------------------------|--------|--------------------|
| GET    | /api/users                  | Admin  | List all users     |
| GET    | /api/users/:id              | Admin  | Get user           |
| PUT    | /api/users/:id              | Admin  | Update user        |
| PATCH  | /api/users/:id/role         | Admin  | Change role        |
| PATCH  | /api/users/:id/deactivate   | Admin  | Deactivate user    |
| PATCH  | /api/users/:id/activate     | Admin  | Activate user      |

## 🏛️ Architecture Decisions

1. **Controller → Service → Repository**: Clean separation of concerns. Controllers handle HTTP, services contain business logic, repositories manage data access.
2. **Soft Delete**: Financial records use `isDeleted` flag instead of hard delete for audit trail.
3. **JWT with Refresh Tokens**: Access tokens expire in 1 hour; refresh tokens provide seamless re-authentication for 7 days.
4. **MongoDB Aggregation Pipelines**: Used for dashboard analytics (summary, category breakdown, trends) for optimal performance.
5. **Joi Validation**: Schema-based input validation on all endpoints with clear error messages.
6. **Rate Limiting**: 100 requests per 15 minutes per IP on API routes.

## ⚖️ Trade-offs

- **Roles as enum (not separate collection)**: Simpler for 3 fixed roles; a separate Roles collection would be needed for dynamic permission systems.
- **No Redis caching**: Analytics queries hit MongoDB directly. For high traffic, Redis caching would improve response times.
- **Client-side routing**: SPA with React Router; server must be configured to serve index.html for all routes in production.

## 📄 License

MIT
