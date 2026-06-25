from typing import Any

from sqlalchemy import ForeignKey, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import IdMixin, TimestampMixin


class Document(IdMixin, TimestampMixin, Base):
    __tablename__ = "documents"

    knowledge_base_id: Mapped[str] = mapped_column(
        ForeignKey("knowledge_bases.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    content_type: Mapped[str | None] = mapped_column(String(120))
    storage_path: Mapped[str] = mapped_column(String(500), nullable=False)
    file_size: Mapped[int] = mapped_column(default=0, nullable=False)
    status: Mapped[str] = mapped_column(String(40), default="uploaded", index=True, nullable=False)
    error_message: Mapped[str | None] = mapped_column(Text)
    document_metadata: Mapped[dict[str, Any]] = mapped_column(
        "metadata",
        JSON,
        default=dict,
        nullable=False,
    )


class DocumentChunk(IdMixin, TimestampMixin, Base):
    __tablename__ = "document_chunks"
    __table_args__ = (UniqueConstraint("document_id", "chunk_index"),)

    document_id: Mapped[str] = mapped_column(
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
    )
    knowledge_base_id: Mapped[str] = mapped_column(
        ForeignKey("knowledge_bases.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    chunk_index: Mapped[int] = mapped_column(nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    token_count: Mapped[int] = mapped_column(default=0, nullable=False)
    chunk_metadata: Mapped[dict[str, Any]] = mapped_column("metadata", JSON, default=dict, nullable=False)
    embedding_model: Mapped[str | None] = mapped_column(String(160))
    vector_id: Mapped[str | None] = mapped_column(String(120))
