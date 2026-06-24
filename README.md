# Enterprise AI Copilot Lab

Enterprise AI Copilot Lab is a learning-oriented enterprise AI application project. The MVP focuses on a complete RAG loop:

```text
document ingest -> chunk and index -> retrieve and answer -> prompt management -> logs and evaluation
```

## Architecture

- `frontend/`: Next.js, React, TypeScript, Tailwind CSS admin console.
- `backend/`: FastAPI modular monolith for auth, knowledge bases, documents, RAG, prompts, and logs.
- `database/`: database migration workspace.
- `infra/`: local infrastructure config.
- `docs/`: product, architecture, plans, ADRs, and runbooks.

## Local Development

```powershell
Copy-Item .env.example .env
Copy-Item frontend/.env.local.example frontend/.env.local
docker compose up --build
```

For host-side backend development:

```powershell
python -m pip install -r requirements-dev.txt
```

Services:

- Frontend: http://localhost:3000
- API: http://localhost:8000
- API health: http://localhost:8000/health
- Qdrant: http://localhost:6333

## Current Milestone

M1 project skeleton:

- FastAPI backend entrypoint and module boundaries.
- Next.js frontend page map for MVP screens.
- PostgreSQL, Redis, and Qdrant via Docker Compose.
- Engineering docs, ADRs, PR template, and CI placeholders.
