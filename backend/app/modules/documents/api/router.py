from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class DocumentSummary(BaseModel):
    id: str
    file_name: str
    status: str


@router.get("", response_model=list[DocumentSummary])
def list_documents() -> list[DocumentSummary]:
    return []
