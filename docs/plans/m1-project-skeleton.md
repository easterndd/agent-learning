# M1 Project Skeleton Plan

## Goal

Create the repository architecture for the Enterprise AI Copilot Lab MVP.

## Deliverables

- Backend FastAPI app and module boundaries.
- Frontend Next.js app and MVP page routes.
- Docker Compose for PostgreSQL, Redis, Qdrant, backend, and frontend.
- Repository guide, architecture docs, ADRs, runbook, PR template, and CI.
- Git repository initialized and synced to GitHub.

## Acceptance Criteria

- `python -m compileall backend/app` succeeds.
- Backend health test can run after installing backend dev dependencies.
- Frontend TypeScript configuration and page files are present.
- Docker Compose defines all MVP runtime units.
- GitHub remote is configured.

## Non-Goals

- Full database models and migrations.
- Real JWT password verification.
- Real document parsing.
- Real embedding or LLM calls.
- Production deployment.
