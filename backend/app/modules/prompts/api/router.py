from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class PromptTemplateSummary(BaseModel):
    id: str
    name: str
    task_type: str
    version: int


@router.get("", response_model=list[PromptTemplateSummary])
def list_prompt_templates() -> list[PromptTemplateSummary]:
    return []
