from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import IdMixin, TimestampMixin


class KnowledgeBase(IdMixin, TimestampMixin, Base):
    __tablename__ = "knowledge_bases"

    workspace_id: Mapped[str] = mapped_column(String(36), default="default", index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(40), default="active", nullable=False)
    document_count: Mapped[int] = mapped_column(default=0, nullable=False)
    chunk_count: Mapped[int] = mapped_column(default=0, nullable=False)
