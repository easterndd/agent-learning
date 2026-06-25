from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.knowledge_base import KnowledgeBase
from app.repositories.base import BaseRepository


class KnowledgeBaseRepository(BaseRepository[KnowledgeBase]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, KnowledgeBase)

    def list_active(self, *, workspace_id: str, limit: int = 100, offset: int = 0) -> list[KnowledgeBase]:
        # 软删除的核心约定：读取业务列表时永远过滤 deleted。
        # TODO: 引入正式 workspace/tenant 表后，把 workspace_id 改成外键。
        statement = (
            select(KnowledgeBase)
            .where(KnowledgeBase.workspace_id == workspace_id, KnowledgeBase.status != "deleted")
            .order_by(KnowledgeBase.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        return list(self.session.scalars(statement))

    def get_active(self, entity_id: str, *, workspace_id: str) -> KnowledgeBase | None:
        statement = select(KnowledgeBase).where(
            KnowledgeBase.id == entity_id,
            KnowledgeBase.workspace_id == workspace_id,
            KnowledgeBase.status != "deleted",
        )
        return self.session.scalar(statement)

    def find_active_by_name(self, name: str, *, workspace_id: str) -> KnowledgeBase | None:
        # 名称唯一只在“同一 workspace 且未删除”范围内检查，允许 deleted 后重新创建同名知识库。
        statement = select(KnowledgeBase).where(
            KnowledgeBase.workspace_id == workspace_id,
            KnowledgeBase.name == name,
            KnowledgeBase.status != "deleted",
        )
        return self.session.scalar(statement)
