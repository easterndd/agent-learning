from typing import Any

from sqlalchemy import ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import IdMixin, TimestampMixin


class ChatSession(IdMixin, TimestampMixin, Base):
    __tablename__ = "chat_sessions"

    user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    knowledge_base_id: Mapped[str | None] = mapped_column(
        ForeignKey("knowledge_bases.id", ondelete="SET NULL"),
        index=True,
    )
    title: Mapped[str | None] = mapped_column(String(255))


class ChatMessage(IdMixin, TimestampMixin, Base):
    __tablename__ = "chat_messages"

    session_id: Mapped[str] = mapped_column(
        ForeignKey("chat_sessions.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    role: Mapped[str] = mapped_column(String(40), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    prompt_template_id: Mapped[str | None] = mapped_column(
        ForeignKey("prompt_templates.id", ondelete="SET NULL"),
    )
    model_provider_id: Mapped[str | None] = mapped_column(
        ForeignKey("model_providers.id", ondelete="SET NULL"),
    )
    model_name: Mapped[str | None] = mapped_column(String(160))
    citations: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    feedback_rating: Mapped[str | None] = mapped_column(String(20))
    feedback_note: Mapped[str | None] = mapped_column(Text)
