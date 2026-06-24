# System Overview

## Principles

- Start with a modular monolith.
- Keep domain logic out of HTTP controllers.
- Use PostgreSQL as the metadata source of truth.
- Use Qdrant only for vector retrieval.
- Treat model providers as replaceable adapters.
- Store important decisions as ADRs.

## Module Map

| Module | Responsibility | MVP Status |
| --- | --- | --- |
| auth | Login, JWT, current user | Skeleton |
| knowledge_bases | Knowledge base lifecycle and ownership | Skeleton |
| documents | Upload, parse, chunk, metadata | Skeleton |
| rag | Retrieval, generation, citations, feedback | Skeleton |
| prompts | Templates, variables, versions | Skeleton |
| logs | Operation and system logs | Skeleton |

## Data Stores

- PostgreSQL: relational metadata and audit records.
- Qdrant: embeddings and payloads for retrieval.
- Redis: cache and future background job queue.
- Local filesystem: uploaded raw files in MVP.

## Planned Tables

MVP:

- `users`
- `knowledge_bases`
- `documents`
- `document_chunks`
- `prompt_templates`
- `prompt_versions`
- `chat_sessions`
- `chat_messages`
- `rag_retrieval_logs`
- `model_call_logs`
- `system_logs`

Stage 2:

- `agent_tasks`
- `agent_steps`
- `tools`
- `mcp_servers`
- `mcp_tool_calls`

Stage 3:

- `eval_datasets`
- `eval_cases`
- `eval_runs`
- `finetune_datasets`
- `finetune_jobs`
- `models`
- `model_versions`
