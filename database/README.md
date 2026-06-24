# Database

This directory is reserved for schema and migration artifacts.

MVP planned tables:

- users
- knowledge_bases
- documents
- document_chunks
- prompt_templates
- prompt_versions
- chat_sessions
- chat_messages
- rag_retrieval_logs
- model_call_logs
- system_logs

Migration rules:

- Use migration files for schema changes.
- Do not edit old migrations after merge.
- Validate migrations against an empty database and an upgraded database.
- Prefer forward-compatible expand/contract changes for risky schema updates.
