# RUNBOOK - Operations Manual

> This file is maintained during development. When deployment, start/stop commands,
> environment variables, dependencies, ports, migrations, scheduled jobs, or common
> troubleshooting steps change, update this runbook in the same change set.
>
> Never write real secrets here. List only the variable name, where it is stored,
> and how to obtain or rotate it.

## 1. Project Basics

- Project name: Enterprise AI Copilot Lab
- Purpose: Learning platform for enterprise AI application engineering, starting with the MVP RAG loop.
- Repository path: `E:\traeproject\agent-learning`
- Runtime style: Docker Compose for local MVP; modular monolith backend.
- Frontend: Next.js, React, TypeScript, Tailwind CSS.
- Backend: FastAPI, Pydantic, SQLAlchemy, Alembic.
- Data stores:
  - PostgreSQL: metadata and audit records.
  - Redis: cache and future background job queue.
  - Qdrant: vector retrieval store.
  - Local filesystem: uploaded raw files under `storage/uploads`.

## 2. Runtime Endpoints

| Item | Value |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:8000` |
| Backend health | `http://localhost:8000/health` |
| API base path | `http://localhost:8000/api/v1` |
| OpenAPI JSON | `http://localhost:8000/api/v1/openapi.json` |
| PostgreSQL | `localhost:5432` from host, `postgres:5432` inside Compose |
| Redis | `localhost:6379` from host, `redis:6379` inside Compose |
| Qdrant HTTP | `http://localhost:6333` from host, `http://qdrant:6333` inside Compose |
| Qdrant gRPC | `localhost:6334` from host |

Production server information: none yet. Add server IP, SSH method, deployment path,
domain, TLS, and exposed ports before any non-local deployment.

## 3. Start, Stop, Restart

Prerequisites:

```powershell
# Docker Desktop or compatible Docker engine must be running.
docker --version
docker compose version
docker info
```

Initial setup:

```powershell
Copy-Item .env.example .env
Copy-Item frontend/.env.local.example frontend/.env.local
npm.cmd install --prefix frontend
python -m pip install -r requirements-dev.txt
```

Start the full local stack:

```powershell
docker compose up --build
```

Run in the background:

```powershell
docker compose up -d --build
```

Stop:

```powershell
docker compose down
```

Restart all services:

```powershell
docker compose restart
```

Restart only one service:

```powershell
docker compose restart backend
docker compose restart frontend
```

Important startup behavior:

- The backend container runs `alembic upgrade head` before `uvicorn`.
- During FastAPI startup, the backend bootstraps the configured admin user if it does not exist.
- Default local admin credentials come from `.env.example`: `ADMIN_USERNAME=admin` and `ADMIN_PASSWORD=admin123456`.

## 4. Update And Deployment

Local update flow:

```powershell
git status --short --branch
git pull
docker compose up -d --build
docker compose ps
Invoke-WebRequest http://localhost:8000/health
Invoke-WebRequest http://localhost:3000
```

If database schema changed:

```powershell
docker compose exec backend alembic upgrade head
```

If frontend dependencies changed:

```powershell
npm.cmd install --prefix frontend
docker compose up -d --build frontend
```

If backend dependencies changed:

```powershell
python -m pip install -r requirements-dev.txt
docker compose up -d --build backend
```

Deployment notes:

- Compose rebuilds may interrupt local service availability.
- Preserve `.env`; do not overwrite local secrets with example files after initial setup.
- Do not commit `.env`, `frontend/.env.local`, uploaded files, local logs, virtualenvs, `node_modules`, or local database volumes.

## 5. Health Checks And Logs

Check container status:

```powershell
docker compose ps
```

Check backend health:

```powershell
Invoke-WebRequest http://localhost:8000/health
```

Check frontend:

```powershell
Invoke-WebRequest http://localhost:3000
```

Follow logs:

```powershell
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
docker compose logs -f redis
docker compose logs -f qdrant
```

Check whether a host port is listening:

```powershell
Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
```

Check local processes:

```powershell
Get-Process -Name python,uvicorn,node -ErrorAction SilentlyContinue
```

Call login API directly:

```powershell
Invoke-WebRequest `
  -Uri http://localhost:8000/api/v1/auth/login `
  -Method Post `
  -ContentType 'application/json' `
  -Body '{"username":"admin","password":"admin123456"}'
```

## 6. Database Operations

Run migrations:

```powershell
docker compose exec backend alembic upgrade head
```

Show current migration:

```powershell
docker compose exec backend alembic current
```

Open PostgreSQL shell:

```powershell
docker compose exec postgres psql -U agent_learning -d agent_learning
```

Useful checks inside `psql`:

```sql
\dt
select id, username, email, is_active, role from users;
```

Create a local database backup:

```powershell
docker compose exec postgres pg_dump -U agent_learning agent_learning > agent_learning_backup.sql
```

Restore a local database backup:

```powershell
Get-Content .\agent_learning_backup.sql | docker compose exec -T postgres psql -U agent_learning -d agent_learning
```

Migration rule:

- Do not modify old merged migrations.
- Add a new Alembic revision for new schema changes.
- Validate empty database upgrade path after schema changes.

## 7. Regular Maintenance

| Item | Command | Frequency |
| --- | --- | --- |
| Check service status | `docker compose ps` | Before each development session |
| Check backend health | `Invoke-WebRequest http://localhost:8000/health` | After each restart or deploy |
| Review backend logs | `docker compose logs --tail=200 backend` | When API behavior changes |
| Review frontend logs | `docker compose logs --tail=200 frontend` | When UI behavior changes |
| Database backup | `docker compose exec postgres pg_dump -U agent_learning agent_learning > agent_learning_backup.sql` | Before risky migration or data reset |
| Docker cleanup | `docker system df` then prune only after review | As needed |
| Uploaded files cleanup | Review `storage/uploads` manually | As needed; do not commit uploads |

No scheduled cleanup job exists yet.

## 8. External Services And Dependencies

| Service | Purpose | Configuration |
| --- | --- | --- |
| PostgreSQL | Metadata, users, audit records | `.env` / `.env.example`: `POSTGRES_*` |
| Redis | Cache and future queue backend | `.env` / `.env.example`: `REDIS_URL` |
| Qdrant | Vector store for retrieval | `.env` / `.env.example`: `QDRANT_URL` |
| OpenAI | Optional model provider | `.env`: `OPENAI_API_KEY`; provider selected by `LLM_PROVIDER` / `EMBEDDING_PROVIDER` |
| DeepSeek | Optional model provider | `.env`: `DEEPSEEK_API_KEY`; provider selected by `LLM_PROVIDER` |
| Local filesystem | Uploaded raw files | `storage/uploads` |

Current default provider mode is mock:

```text
LLM_PROVIDER=mock
EMBEDDING_PROVIDER=mock
```

## 9. Credential Inventory

| Credential | Where | Owner / Rotation Notes |
| --- | --- | --- |
| PostgreSQL password | `.env`: `POSTGRES_PASSWORD` | Local default is for development only. Use a real secret for non-local environments. |
| JWT secret | `.env`: `JWT_SECRET_KEY` | Must be changed before sharing or deploying beyond local development. Rotating it invalidates existing tokens. |
| Admin bootstrap password | `.env`: `ADMIN_PASSWORD` | Used only to create the admin if it does not exist. Change before non-local deployment. |
| OpenAI API key | `.env`: `OPENAI_API_KEY` | Obtain from OpenAI account/project settings. Do not commit. |
| DeepSeek API key | `.env`: `DEEPSEEK_API_KEY` | Obtain from provider console. Do not commit. |

## 10. Background Jobs

Current state:

- No cron jobs.
- No worker process.
- Redis is included for cache and future queue support, but the current login path does not depend on Redis.

When background jobs are added, document:

- Process name and start command.
- Queue names.
- Retry and dead-letter behavior.
- Required environment variables.
- How to inspect stalled or failed jobs.

## 11. Common Issues And Troubleshooting

| Symptom | Check / Fix |
| --- | --- |
| Login page shows "username or password incorrect" and browser console shows `net::ERR_CONNECTION_REFUSED http://localhost:8000/api/v1/auth/login` | Backend is not reachable. Check `docker compose ps`, `Get-NetTCPConnection -LocalPort 8000 -State Listen`, and `docker compose logs -f backend`. Start Docker Desktop, then run `docker compose up --build`. |
| `docker compose ps` fails with Docker API or `docker_engine` pipe error | Docker Desktop or Docker daemon is not running. Start Docker Desktop and retry. |
| `failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine` | Docker Desktop's Linux engine is not running. Open Docker Desktop, wait until it says "Engine running", then run `docker info`. If it still fails, restart Docker Desktop from the tray menu. If needed, restart WSL with `wsl --shutdown`, open Docker Desktop again, then retry `docker compose up -d --build`. |
| Backend container exits on first startup with missing database table errors | Ensure the backend image includes the current `Dockerfile` command that runs `alembic upgrade head` before `uvicorn`, then rebuild with `docker compose up -d --build backend`. |
| `dependency failed to start: container agent-learning-postgres-1 is unhealthy` | Check `docker compose ps` and `docker compose logs --tail=200 postgres`. On first startup, Postgres initialization can take longer than the dependency wait window. If logs show `database system is ready to accept connections` and `docker compose ps` later shows `postgres` as healthy, rerun `docker compose up -d`. |
| Admin credentials seem correct but login returns `401` | Confirm the user exists in Postgres: `docker compose exec postgres psql -U agent_learning -d agent_learning`, then `select username, is_active from users;`. If the user was created with an old password, update/reset through an application-supported path before relying on `.env` bootstrap values. |
| Redis is not installed locally | No manual Redis install is required for the Compose workflow. Redis runs as the `redis` container. Use `docker compose ps redis` and `docker compose logs -f redis`. |
| `http://localhost:8000/health` times out or refuses connection | Backend is not running or not bound to port 8000. Check `docker compose ps backend`, `docker compose logs -f backend`, and host port conflicts. |
| Port conflict on `3000`, `5432`, `6379`, `6333`, or `8000` | Stop the conflicting local process or change Compose port mappings intentionally, then update this runbook and frontend API base URL if needed. On Windows, find the owner with `netstat -ano \| Select-String ":3000"` and inspect it with `Get-Process -Id <PID>`. |
| Frontend container fails with `listen tcp 0.0.0.0:3000: bind: Only one usage of each socket address` | Port 3000 is already in use, often by a host `node` / Next.js dev server. Either keep using the existing frontend at `http://localhost:3000`, stop the process occupying 3000, or change the Compose frontend published port and update docs/config accordingly. |
| Frontend calls the wrong API URL | Check `frontend/.env.local`: `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1`. Restart frontend after changing it. |
| CORS errors from frontend | Confirm backend `FRONTEND_URL` matches the browser origin, usually `http://localhost:3000`, then restart backend. |
| Database connection fails from host-run backend | Use `backend/.env.example` style host settings: `POSTGRES_HOST=localhost`, `REDIS_URL=redis://localhost:6379/0`, `QDRANT_URL=http://localhost:6333`. The root `.env` is for Compose and uses service names such as `postgres` and `redis`. |
| Dependency install fails because of network access | Retry in an approved network context. For frontend use `npm.cmd install --prefix frontend`; for backend use `python -m pip install -r requirements-dev.txt`. |

## 12. Verification Commands

Backend:

```powershell
python -m pytest backend/tests
python -m ruff check backend
```

Frontend:

```powershell
npm.cmd run lint --prefix frontend
npm.cmd run typecheck --prefix frontend
npm.cmd run build --prefix frontend
```

API smoke test:

```powershell
Invoke-WebRequest http://localhost:8000/health
Invoke-WebRequest `
  -Uri http://localhost:8000/api/v1/auth/login `
  -Method Post `
  -ContentType 'application/json' `
  -Body '{"username":"admin","password":"admin123456"}'
```

## 13. Documentation Map

- Product docs: `docs/product/`
- Architecture docs: `docs/architecture/`
- ADRs: `docs/architecture/adr/`
- Plans: `docs/plans/`
- Local development runbook: `docs/runbooks/local-development.md`
- Runbook template source: `docs/source/RUNBOOK_模板.md`
