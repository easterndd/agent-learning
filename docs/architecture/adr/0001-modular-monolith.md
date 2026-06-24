# ADR-0001: Use A Modular Monolith For MVP

- Status: Accepted
- Date: 2026-06-24
- Decision makers: Project owner, Codex

## Context

The PRD covers RAG, Prompt management, Agent, MCP, LoRA, model deployment, evaluation, and operations. Implementing these as services at the start would add deployment and integration complexity before the main RAG loop is proven.

## Decision

Use one FastAPI backend organized by business modules. Keep dependencies flowing from API to application to domain to infrastructure adapters.

## Alternatives

- Microservices per capability.
- A single flat FastAPI app with controllers, services, and models directories.

## Rationale

The modular monolith keeps local development simple while preserving module boundaries for later extraction if a real scale or ownership need appears.

## Consequences

- Positive: lower operational cost, simpler local setup, easier testing.
- Negative: module boundaries require discipline and review.
- Follow-up: enforce boundaries with documentation, tests, and review.

## Verification

New features should land inside a named module and avoid cross-module internal imports.
