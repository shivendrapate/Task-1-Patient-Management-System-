# Patient Management System Frontend

React + TypeScript + Vite frontend for the FastAPI backend in this repository.

## Features

- JWT login (`/auth/login`) with refresh-token rotation (`/auth/refresh`)
- Access and refresh tokens stored in localStorage (`pms_access_token`, `pms_refresh_token`)
- Role-aware navigation for admin, doctor, patient
- Role-based login options: doctor, patient, admin (admin includes super_admin)
- `My Details` view shows role-specific `doctor_id` or `patient_id`
- Explicit UI actions for every non-DB endpoint:
  - `POST /auth/login`
  - `POST /auth/refresh` (called automatically by interceptor)
  - `POST /users/`
  - `GET /users/{user_id}`
  - `GET /users/`
  - `PUT /users/{user_id}`
  - `PATCH /users/{user_id}`
  - `DELETE /users/{user_id}`
  - `DELETE /users/{user_id}/soft_delete_user`
  - `POST /users/{user_id}/restore`
  - `POST /assignments/`
  - `GET /assignments/doctor/{doctor_id}/patients`
  - `GET /assignments/patient/{patient_id}/doctors`
  - `GET /`

## Project structure

- `src/services/*`: typed API service layer
- `src/pages/*`: endpoint-specific UI pages
- `src/context/AuthContext.tsx`: auth state and token lifecycle
- `src/router/index.tsx`: guarded routes
- `src/styles/*`: theme, layout, components
- `src/test/*`: Vitest + MSW smoke tests

## Run locally

### 1) Start backend (from repo root)

```bash
./venv/bin/uvicorn app.main:app --reload
```

### 2) Start frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on Vite default port and calls backend through proxy (`/api` -> `http://127.0.0.1:8000`).

`/users/create` is protected and intended for `admin`/`super_admin` users.

## Build and test

```bash
npm run lint
npm run test:run
npm run build
```

## Environment

`frontend/.env`:

```env
VITE_API_BASE_URL=/api
```
