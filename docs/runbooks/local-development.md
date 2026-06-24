# Local Development Runbook

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

```powershell
docker compose up --build
```

## Verify

```powershell
Invoke-WebRequest http://localhost:8000/health
Invoke-WebRequest http://localhost:3000
```

## Common Issues

- If ports conflict, stop the local service using ports `3000`, `5432`, `6379`, `6333`, or `8000`.
- If dependency install fails because of network access, retry with an approved network context.
- Do not commit `.env`, uploaded files, logs, or local database volumes.

## Environment Files

- `.env.example`: Docker Compose defaults.
- `.env`: local Docker Compose runtime file, ignored by Git.
- `backend/.env.example`: defaults for running the API directly on the host.
- `frontend/.env.local.example`: browser-facing API base URL template.
- `frontend/.env.local`: local Next.js runtime file, ignored by Git.
