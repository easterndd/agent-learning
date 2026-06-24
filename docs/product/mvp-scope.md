# MVP Scope

## Goal

Build the smallest complete enterprise knowledge-base RAG loop.

```text
Login
  -> create knowledge base
  -> upload document
  -> parse and chunk
  -> embed and index
  -> ask with RAG
  -> show citations
  -> save logs and feedback
```

## Must Have

- Web admin console.
- FastAPI backend.
- JWT authentication.
- PostgreSQL metadata store.
- Redis cache and future queue backend.
- Local file storage.
- Qdrant vector store.
- Document parsing boundaries for PDF, Markdown, TXT, and CSV.
- Prompt template management.
- RAG answer records, retrieval logs, and manual feedback.

## Not In MVP

- Complex LangGraph Agent workflows.
- MCP tool integration.
- LoRA or QLoRA training.
- vLLM production deployment.
- Kubernetes production HA.
- Browser extension, mini program, or mobile app.
- Commercial multi-tenant billing.

## Success Criteria

- The stack starts with Docker Compose.
- A user can log in.
- A user can create a knowledge base.
- A user can upload a document.
- The system can parse and chunk supported files.
- The system can embed chunks and write vectors.
- A user can ask questions against a knowledge base.
- Answers include citations.
- Prompt templates can be managed.
- Question, retrieval, model, and feedback records are saved.
