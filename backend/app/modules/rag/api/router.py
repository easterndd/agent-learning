from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class AskRequest(BaseModel):
    knowledge_base_id: str
    question: str
    prompt_template_id: str | None = None
    top_k: int = 5


class AskResponse(BaseModel):
    answer: str
    citations: list[dict[str, str]]


@router.post("/ask", response_model=AskResponse)
def ask(payload: AskRequest) -> AskResponse:
    return AskResponse(
        answer=f"RAG pipeline placeholder for: {payload.question}",
        citations=[],
    )
