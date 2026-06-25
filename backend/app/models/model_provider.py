from typing import Any

from sqlalchemy import Boolean, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import IdMixin, TimestampMixin


class ModelProvider(IdMixin, TimestampMixin, Base):
    __tablename__ = "model_providers"

    name: Mapped[str] = mapped_column(String(120), nullable=False)
    provider_type: Mapped[str] = mapped_column(String(40), nullable=False)
    base_url: Mapped[str | None] = mapped_column(String(500))
    api_key_ciphertext: Mapped[str | None] = mapped_column(Text)
    chat_model: Mapped[str | None] = mapped_column(String(160))
    embedding_model: Mapped[str | None] = mapped_column(String(160))
    rerank_model: Mapped[str | None] = mapped_column(String(160))
    capabilities: Mapped[list[str | dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False, index=True, nullable=False)
    health_status: Mapped[str] = mapped_column(String(40), default="unknown", nullable=False)
    timeout_seconds: Mapped[int] = mapped_column(default=60, nullable=False)
