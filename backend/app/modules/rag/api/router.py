from fastapi import APIRouter
from pydantic import BaseModel, ConfigDict

from app.modules.model_providers.api.router import get_default_model_provider

router = APIRouter()


class AskRequest(BaseModel):
    knowledge_base_id: str
    question: str
    prompt_template_id: str | None = None
    top_k: int = 5


class AskResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    answer: str
    citations: list[dict[str, str]]
    model_provider_id: str
    model_name: str


@router.post("/ask", response_model=AskResponse)
def ask(payload: AskRequest) -> AskResponse:
    provider = get_default_model_provider()
    return AskResponse(
        answer=f"RAG pipeline placeholder for: {payload.question}",
        citations=[],
        model_provider_id=provider.id,
        model_name=provider.chat_model,
    )
