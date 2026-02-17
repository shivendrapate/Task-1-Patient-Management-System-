# Patient Management System (Full-Stack)

A full-stack Patient Management System built to learn and demonstrate backend engineering, frontend integration, authentication, authorization, and relational data modeling.

## Quick Summary

- Backend: FastAPI + SQLAlchemy + PostgreSQL + Alembic + JWT
- Frontend: React + Vite + TypeScript + Axios + React Router
- Auth: JWT access + refresh tokens with role-based and relationship-based access control
- Domain model: `users`, `doctors`, `patients`, `doctor_patient` association
- Data lifecycle: hard delete + soft delete (`users.delete_at`) + restore

## Documentation Map

- Deep technical documentation: `PROJECT_DOCUMENTATION.md`
- Architecture-focused documentation: `ARCHITECTURE.md`
- Frontend-specific guide: `frontend/README.md`

## Repository Structure

```text
.
|- app/
|  |- api/v1/            # FastAPI routes (auth, users, assignments)
|  |- core/              # JWT security + auth dependencies
|  |- db/                # Engine/session/dependencies
|  |- models/            # SQLAlchemy ORM models
|  |- schemas/           # Pydantic request/response schemas
|  |- services/          # Business logic layer
|  `- main.py            # App bootstrap, middleware, routers
|- alembic/              # Migration environment + revisions
|- frontend/             # React frontend
|- requirements.txt      # Backend Python dependencies
`- .env                  # Runtime environment variables
```

## Key Features

- User registration and login
- Refresh-token based access-token renewal
- JWT-protected APIs
- Role-based authorization (`admin`, `super_admin`, `doctor`, `patient`)
- Relationship-based authorization (doctor can access own patients, patient can access own doctors)
- User creation restricted to `admin` and `super_admin`
- `super_admin` users cannot be hard-deleted or soft-deleted
- User list with pagination and filtering
- Full/partial updates (`PUT` + `PATCH`)
- User hard delete, soft delete, and restore
- Doctor-patient many-to-many assignment
- Frontend role-aware UI and protected routes

## API Coverage

The frontend intentionally covers every non-DB diagnostic endpoint exposed by the backend.

Covered endpoints:

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /users/`
- `GET /users/`
- `GET /users/{user_id}`
- `PUT /users/{user_id}`
- `PATCH /users/{user_id}`
- `DELETE /users/{user_id}`
- `DELETE /users/{user_id}/soft_delete_user`
- `POST /users/{user_id}/restore`
- `POST /assignments/`
- `GET /assignments/doctor/{doctor_id}/patients`
- `GET /assignments/patient/{patient_id}/doctors`
- `GET /`

Excluded from frontend UI:

- `GET /db-test`
- `GET /db-session-test`

## Local Setup

### 1) Clone and open project

```bash
git clone <your-repo-url>
cd "Task 1"
```

### 2) Backend setup

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create/update `.env` at repo root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=patient_db
DB_USER=patient_user
DB_PASSWORD=1111
DB_DRIVER=postgresql
SECRET_KEY=<your-secret>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

Run migrations:

```bash
alembic upgrade head
```

Start backend:

```bash
./venv/bin/uvicorn app.main:app --reload
```

Backend base URL: `http://127.0.0.1:8000`

### 3) Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend uses Vite proxy (`/api` -> `http://127.0.0.1:8000`).

## Verification Commands

From `frontend/`:

```bash
npm run lint
npm run test:run
npm run build
```

## Notes

- Soft delete field is implemented as `delete_at` (not `deleted_at`) in the current codebase.
- Frontend uses `My Details` to display role-specific profile IDs (`doctor_id` or `patient_id`) when available.

For full architecture, API contract details, role matrix, sequence diagrams, and deployment/testing strategy, see `PROJECT_DOCUMENTATION.md` and `ARCHITECTURE.md`.
