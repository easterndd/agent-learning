from typing import Any

from sqlalchemy import Boolean, ForeignKey, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import IdMixin, TimestampMixin


class PromptTemplate(IdMixin, TimestampMixin, Base):
    __tablename__ = "prompt_templates"

    name: Mapped[str] = mapped_column(String(160), nullable=False)
    task_type: Mapped[str] = mapped_column(String(80), index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    current_version: Mapped[int] = mapped_column(default=1, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class PromptVersion(IdMixin, TimestampMixin, Base):
    __tablename__ = "prompt_versions"
    __table_args__ = (UniqueConstraint("prompt_template_id", "version"),)

    prompt_template_id: Mapped[str] = mapped_column(
        ForeignKey("prompt_templates.id", ondelete="CASCADE"),
        nullable=False,
    )
    version: Mapped[int] = mapped_column(nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    variables: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    created_by: Mapped[str | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
