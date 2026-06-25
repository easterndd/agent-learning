# Local Development Runbook

For the full operations manual, see `RUNBOOK.md` at the repository root.

## Prerequisites

- Docker Desktop or compatible Docker engine.
- Node.js 22 or newer.
- Python 3.12 or newer.

## Setup

```powershell
Copy-Item .env.example .env
Copy-Item frontend/.env.local.example frontend/.env.local
npm.cmd install --prefix frontend
python -m pip install -r requirements-dev.txt
```

## Start The Stack

Before starting, Docker Desktop must show that the engine is running:

```powershell
docker info
```

```powershell
docker compose up --build
```

The backend container runs `alembic upgrade head` before starting FastAPI, then
bootstraps the configured admin user if it does not already exist.

## Verify

```powershell
Invoke-WebRequest http://localhost:8000/health
Invoke-WebRequest http://localhost:3000
```

## Common Issues

- If ports conflict, stop the local service using ports `3000`, `5432`, `6379`, `6333`, or `8000`.
- If login fails with `net::ERR_CONNECTION_REFUSED http://localhost:8000/api/v1/auth/login`, the backend is not reachable. Start Docker Desktop, run `docker compose up --build`, and verify `http://localhost:8000/health`.
- If Compose reports `npipe:////./pipe/dockerDesktopLinuxEngine`, Docker Desktop's Linux engine is not running. Open Docker Desktop, wait for the engine, retry `docker info`, then retry Compose. If it still fails, restart Docker Desktop or run `wsl --shutdown` before opening Docker Desktop again.
- If Compose reports `agent-learning-postgres-1 is unhealthy`, check `docker compose logs --tail=200 postgres`. If Postgres later shows healthy in `docker compose ps`, rerun `docker compose up -d`.
- If frontend startup fails because port `3000` is already in use, find the owner with `netstat -ano | Select-String ":3000"` and inspect it with `Get-Process -Id <PID>`. Stop that process or keep using the already-running frontend.
- Redis does not need to be installed manually for local Compose usage. It runs as the `redis` container.
- If dependency install fails because of network access, retry with an approved network context.
- Do not commit `.env`, uploaded files, logs, or local database volumes.

## Environment Files

- `.env.example`: Docker Compose defaults.
- `.env`: local Docker Compose runtime file, ignored by Git.
- `backend/.env.example`: defaults for running the API directly on the host.
- `frontend/.env.local.example`: browser-facing API base URL template.
- `frontend/.env.local`: local Next.js runtime file, ignored by Git.
