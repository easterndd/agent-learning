from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class SystemLogEntry(BaseModel):
    id: str
    level: str
    message: str


@router.get("", response_model=list[SystemLogEntry])
def list_logs() -> list[SystemLogEntry]:
    return []
