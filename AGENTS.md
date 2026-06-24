# Repository Guide

## Purpose

Build a maintainable learning platform for enterprise AI application engineering, starting with the MVP RAG loop.

## Map

- `frontend/`: Next.js admin console.
- `backend/`: FastAPI modular monolith.
- `database/`: schema and migration workspace.
- `infra/`: Docker and infrastructure configuration.
- `docs/`: project facts, plans, ADRs, and runbooks.
- `storage/`: local development file storage. Do not commit uploaded files.

## Commands

- Install frontend: `npm.cmd install --prefix frontend`
- Backend dev install: `python -m pip install -e backend[dev]`
- Dev stack: `docker compose up --build`
- Backend test: `python -m pytest backend/tests`
- Backend lint: `python -m ruff check backend`
- Frontend lint: `npm.cmd run lint --prefix frontend`
- Frontend typecheck: `npm.cmd run typecheck --prefix frontend`
- Frontend build: `npm.cmd run build --prefix frontend`

## Architecture

- Use a modular monolith before considering services.
- Controllers expose HTTP only; application services own use cases.
- Domain rules must not depend on FastAPI, SQLAlchemy, Redis, or Qdrant.
- Infrastructure adapters isolate database, vector store, queue, file storage, and model providers.
- Public API changes must update docs or generated contracts before implementation work expands.
- See `ARCHITECTURE.md` and `docs/architecture/adr/`.

## Working Rules

- Check `git status --short --branch` before editing.
- Do not overwrite existing uncommitted work.
- Do not commit secrets, logs, local uploads, virtualenvs, build output, or node modules.
- Do not modify old database migrations after they are merged.
- Add tests for new behavior.
- Keep changes scoped to the task and avoid broad refactors.

## Verification

- Code changes: run relevant lint, typecheck, and tests.
- API changes: validate request/response schemas and integration path.
- UI changes: verify key states and responsive behavior.
- Database changes: validate empty database migration and upgrade path.

## Docs

- Product: `docs/product/`
- Architecture: `docs/architecture/`
- Plans: `docs/plans/`
- Runbooks: `docs/runbooks/`
