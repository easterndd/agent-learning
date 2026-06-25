from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db_session
from app.models.knowledge_base import KnowledgeBase
from app.repositories.knowledge_bases import KnowledgeBaseRepository

router = APIRouter()

# 这个模块先直接写 CRUD 路由，等业务规则变复杂后再抽 application service。
# 学习重点：Schema 负责入参/出参，Repository 负责查询，路由负责 HTTP 状态码。


class KnowledgeBaseCreate(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    description: str | None = Field(default=None, max_length=2000)


class KnowledgeBaseUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=160)
    description: str | None = Field(default=None, max_length=2000)
    status: str | None = Field(default=None, pattern="^(active|disabled)$")


class KnowledgeBaseSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    workspace_id: str
    name: str
    description: str | None
    document_count: int
    chunk_count: int
    status: str
    created_at: datetime
    updated_at: datetime


def normalize_name(name: str) -> str:
    # 把用户输入的多余空格收敛，避免 "员工手册" 和 " 员工手册 " 被当成两个名称。
    return " ".join(name.strip().split())


def ensure_unique_active_name(
    repository: KnowledgeBaseRepository,
    *,
    name: str,
    workspace_id: str,
    current_id: str | None = None,
) -> None:
    # MVP 暂时没有 workspace 表，因此用 settings.default_workspace_id 做过渡。
    # TODO: 阶段进入多租户后，把 workspace_id 从当前登录用户/请求上下文中取。
    existing = repository.find_active_by_name(name, workspace_id=workspace_id)
    if existing is not None and existing.id != current_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Knowledge base name already exists in this workspace",
        )


@router.get("", response_model=list[KnowledgeBaseSummary])
def list_knowledge_bases(
    session: Session = Depends(get_db_session),
    limit: int = Query(default=100, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
) -> list[KnowledgeBase]:
    # 返回 SQLAlchemy model，由 Pydantic from_attributes 转成响应模型。
    repository = KnowledgeBaseRepository(session)
    return repository.list_active(
        workspace_id=settings.default_workspace_id,
        limit=limit,
        offset=offset,
    )


@router.post("", response_model=KnowledgeBaseSummary, status_code=status.HTTP_201_CREATED)
def create_knowledge_base(
    payload: KnowledgeBaseCreate,
    session: Session = Depends(get_db_session),
) -> KnowledgeBase:
    repository = KnowledgeBaseRepository(session)
    name = normalize_name(payload.name)
    ensure_unique_active_name(repository, name=name, workspace_id=settings.default_workspace_id)

    knowledge_base = repository.add(
        KnowledgeBase(
            workspace_id=settings.default_workspace_id,
            name=name,
            description=payload.description,
            status="active",
        ),
    )
    # 写接口显式 commit，随后 refresh 取回数据库生成的 created_at/updated_at。
    session.commit()
    session.refresh(knowledge_base)
    return knowledge_base


@router.get("/{knowledge_base_id}", response_model=KnowledgeBaseSummary)
def get_knowledge_base(
    knowledge_base_id: str,
    session: Session = Depends(get_db_session),
) -> KnowledgeBase:
    knowledge_base = KnowledgeBaseRepository(session).get_active(
        knowledge_base_id,
        workspace_id=settings.default_workspace_id,
    )
    if knowledge_base is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Knowledge base not found")
    return knowledge_base


@router.patch("/{knowledge_base_id}", response_model=KnowledgeBaseSummary)
def update_knowledge_base(
    knowledge_base_id: str,
    payload: KnowledgeBaseUpdate,
    session: Session = Depends(get_db_session),
) -> KnowledgeBase:
    repository = KnowledgeBaseRepository(session)
    knowledge_base = repository.get_active(knowledge_base_id, workspace_id=settings.default_workspace_id)
    if knowledge_base is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Knowledge base not found")

    update = payload.model_dump(exclude_unset=True)
    if "name" in update and update["name"] is not None:
        # 改名时也要复用创建时的唯一性规则。
        update["name"] = normalize_name(update["name"])
        ensure_unique_active_name(
            repository,
            name=update["name"],
            workspace_id=settings.default_workspace_id,
            current_id=knowledge_base.id,
        )

    for key, value in update.items():
        setattr(knowledge_base, key, value)

    session.commit()
    session.refresh(knowledge_base)
    return knowledge_base


@router.delete("/{knowledge_base_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_knowledge_base(
    knowledge_base_id: str,
    session: Session = Depends(get_db_session),
) -> None:
    knowledge_base = KnowledgeBaseRepository(session).get_active(
        knowledge_base_id,
        workspace_id=settings.default_workspace_id,
    )
    if knowledge_base is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Knowledge base not found")

    # 软删除：保留历史数据和未来审计线索，只让业务查询看不见它。
    knowledge_base.status = "deleted"
    session.commit()
