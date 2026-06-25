from typing import Any

from sqlalchemy import ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import IdMixin, TimestampMixin


class RagRetrievalLog(IdMixin, TimestampMixin, Base):
    __tablename__ = "rag_retrieval_logs"

    message_id: Mapped[str | None] = mapped_column(ForeignKey("chat_messages.id", ondelete="SET NULL"))
    knowledge_base_id: Mapped[str | None] = mapped_column(
        ForeignKey("knowledge_bases.id", ondelete="SET NULL"),
    )
    question: Mapped[str] = mapped_column(Text, nullable=False)
    embedding_model: Mapped[str | None] = mapped_column(String(160))
    retrieved_chunk_ids: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    scores: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    top_k: Mapped[int] = mapped_column(default=5, nullable=False)
    latency_ms: Mapped[int] = mapped_column(default=0, nullable=False)


class ModelCallLog(IdMixin, TimestampMixin, Base):
    __tablename__ = "model_call_logs"

    message_id: Mapped[str | None] = mapped_column(ForeignKey("chat_messages.id", ondelete="SET NULL"))
    model_provider_id: Mapped[str | None] = mapped_column(
        ForeignKey("model_providers.id", ondelete="SET NULL"),
    )
    model_name: Mapped[str] = mapped_column(String(160), nullable=False)
    operation: Mapped[str] = mapped_column(String(40), nullable=False)
    status: Mapped[str] = mapped_column(String(40), index=True, nullable=False)
    prompt_tokens: Mapped[int | None] = mapped_column()
    completion_tokens: Mapped[int | None] = mapped_column()
    latency_ms: Mapped[int] = mapped_column(default=0, nullable=False)
    error_message: Mapped[str | None] = mapped_column(Text)


class SystemLog(IdMixin, TimestampMixin, Base):
    __tablename__ = "system_logs"

    level: Mapped[str] = mapped_column(String(20), nullable=False)
    event_type: Mapped[str] = mapped_column(String(80), index=True, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    actor_user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    entity_type: Mapped[str | None] = mapped_column(String(80))
    entity_id: Mapped[str | None] = mapped_column(String(36))
    payload: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
