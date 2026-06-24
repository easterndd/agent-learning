# ADR-0002: Use Next.js, FastAPI, PostgreSQL, Redis, And Qdrant

- Status: Accepted
- Date: 2026-06-24
- Decision makers: Project owner, Codex

## Context

The MVP needs a web admin console, Python AI application backend, metadata persistence, cache or queue support, and a lightweight vector store.

## Decision

- Frontend: Next.js, React, TypeScript, Tailwind CSS.
- Backend: FastAPI and Pydantic.
- Metadata: PostgreSQL.
- Cache and future queue: Redis.
- Vector store: Qdrant.
- Runtime orchestration: Docker Compose.

## Alternatives

- Milvus instead of Qdrant.
- A pure Python server-rendered frontend.
- Kubernetes from the first milestone.

## Rationale

This stack matches the PRD, keeps MVP deployment lightweight, and leaves room for future LangGraph, MCP, LoRA, and model serving modules.

## Consequences

- Qdrant is easier to run locally than Milvus but may need reevaluation for very large scale.
- Docker Compose is enough for MVP but not a final production HA deployment.

## Verification

The stack must start locally with `docker compose up --build`.
