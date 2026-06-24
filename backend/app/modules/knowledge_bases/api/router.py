from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class KnowledgeBaseSummary(BaseModel):
    id: str
    name: str
    document_count: int = 0


@router.get("", response_model=list[KnowledgeBaseSummary])
def list_knowledge_bases() -> list[KnowledgeBaseSummary]:
    return []
