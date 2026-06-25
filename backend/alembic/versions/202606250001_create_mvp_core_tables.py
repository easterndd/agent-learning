"""create mvp core tables

Revision ID: 202606250001
Revises:
Create Date: 2026-06-25 00:01:00
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "202606250001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def timestamps() -> tuple[sa.Column, sa.Column]:
    return (
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("username", sa.String(length=80), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("display_name", sa.String(length=120), nullable=True),
        sa.Column("role", sa.String(length=40), nullable=False, server_default="admin"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        *timestamps(),
        sa.UniqueConstraint("email", name="uq_users_email"),
        sa.UniqueConstraint("username", name="uq_users_username"),
    )

    op.create_table(
        "knowledge_bases",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("workspace_id", sa.String(length=36), nullable=False, server_default="default"),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=40), nullable=False, server_default="active"),
        sa.Column("document_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("chunk_count", sa.Integer(), nullable=False, server_default="0"),
        *timestamps(),
    )
    op.create_index("ix_knowledge_bases_workspace_id", "knowledge_bases", ["workspace_id"])
    op.create_index("ix_knowledge_bases_status", "knowledge_bases", ["status"])

    op.create_table(
        "model_providers",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("provider_type", sa.String(length=40), nullable=False),
        sa.Column("base_url", sa.String(length=500), nullable=True),
        sa.Column("api_key_ciphertext", sa.Text(), nullable=True),
        sa.Column("chat_model", sa.String(length=160), nullable=True),
        sa.Column("embedding_model", sa.String(length=160), nullable=True),
        sa.Column("rerank_model", sa.String(length=160), nullable=True),
        sa.Column("capabilities", sa.JSON(), nullable=False, server_default=sa.text("'[]'")),
        sa.Column("is_default", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("health_status", sa.String(length=40), nullable=False, server_default="unknown"),
        sa.Column("timeout_seconds", sa.Integer(), nullable=False, server_default="60"),
        *timestamps(),
    )
    op.create_index("ix_model_providers_is_default", "model_providers", ["is_default"])

    op.create_table(
        "prompt_templates",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("task_type", sa.String(length=80), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("current_version", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        *timestamps(),
    )
    op.create_index("ix_prompt_templates_task_type", "prompt_templates", ["task_type"])

    op.create_table(
        "documents",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("knowledge_base_id", sa.String(length=36), nullable=False),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("content_type", sa.String(length=120), nullable=True),
        sa.Column("storage_path", sa.String(length=500), nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("status", sa.String(length=40), nullable=False, server_default="uploaded"),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("metadata", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        *timestamps(),
        sa.ForeignKeyConstraint(["knowledge_base_id"], ["knowledge_bases.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_documents_knowledge_base_id", "documents", ["knowledge_base_id"])
    op.create_index("ix_documents_status", "documents", ["status"])

    op.create_table(
        "prompt_versions",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("prompt_template_id", sa.String(length=36), nullable=False),
        sa.Column("version", sa.Integer(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("variables", sa.JSON(), nullable=False, server_default=sa.text("'[]'")),
        sa.Column("created_by", sa.String(length=36), nullable=True),
        *timestamps(),
        sa.ForeignKeyConstraint(["created_by"], ["users.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["prompt_template_id"], ["prompt_templates.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("prompt_template_id", "version", name="uq_prompt_versions_template_version"),
    )

    op.create_table(
        "chat_sessions",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("user_id", sa.String(length=36), nullable=True),
        sa.Column("knowledge_base_id", sa.String(length=36), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=True),
        *timestamps(),
        sa.ForeignKeyConstraint(["knowledge_base_id"], ["knowledge_bases.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
    )
    op.create_index("ix_chat_sessions_knowledge_base_id", "chat_sessions", ["knowledge_base_id"])

    op.create_table(
        "document_chunks",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("document_id", sa.String(length=36), nullable=False),
        sa.Column("knowledge_base_id", sa.String(length=36), nullable=False),
        sa.Column("chunk_index", sa.Integer(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("token_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("metadata", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("embedding_model", sa.String(length=160), nullable=True),
        sa.Column("vector_id", sa.String(length=120), nullable=True),
        *timestamps(),
        sa.ForeignKeyConstraint(["document_id"], ["documents.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["knowledge_base_id"], ["knowledge_bases.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("document_id", "chunk_index", name="uq_document_chunks_document_index"),
    )
    op.create_index("ix_document_chunks_knowledge_base_id", "document_chunks", ["knowledge_base_id"])

    op.create_table(
        "chat_messages",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("session_id", sa.String(length=36), nullable=False),
        sa.Column("role", sa.String(length=40), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("prompt_template_id", sa.String(length=36), nullable=True),
        sa.Column("model_provider_id", sa.String(length=36), nullable=True),
        sa.Column("model_name", sa.String(length=160), nullable=True),
        sa.Column("citations", sa.JSON(), nullable=False, server_default=sa.text("'[]'")),
        sa.Column("feedback_rating", sa.String(length=20), nullable=True),
        sa.Column("feedback_note", sa.Text(), nullable=True),
        *timestamps(),
        sa.ForeignKeyConstraint(["model_provider_id"], ["model_providers.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["prompt_template_id"], ["prompt_templates.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["session_id"], ["chat_sessions.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_chat_messages_session_id", "chat_messages", ["session_id"])

    op.create_table(
        "rag_retrieval_logs",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("message_id", sa.String(length=36), nullable=True),
        sa.Column("knowledge_base_id", sa.String(length=36), nullable=True),
        sa.Column("question", sa.Text(), nullable=False),
        sa.Column("embedding_model", sa.String(length=160), nullable=True),
        sa.Column("retrieved_chunk_ids", sa.JSON(), nullable=False, server_default=sa.text("'[]'")),
        sa.Column("scores", sa.JSON(), nullable=False, server_default=sa.text("'[]'")),
        sa.Column("top_k", sa.Integer(), nullable=False, server_default="5"),
        sa.Column("latency_ms", sa.Integer(), nullable=False, server_default="0"),
        *timestamps(),
        sa.ForeignKeyConstraint(["knowledge_base_id"], ["knowledge_bases.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["message_id"], ["chat_messages.id"], ondelete="SET NULL"),
    )

    op.create_table(
        "model_call_logs",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("message_id", sa.String(length=36), nullable=True),
        sa.Column("model_provider_id", sa.String(length=36), nullable=True),
        sa.Column("model_name", sa.String(length=160), nullable=False),
        sa.Column("operation", sa.String(length=40), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("prompt_tokens", sa.Integer(), nullable=True),
        sa.Column("completion_tokens", sa.Integer(), nullable=True),
        sa.Column("latency_ms", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("error_message", sa.Text(), nullable=True),
        *timestamps(),
        sa.ForeignKeyConstraint(["message_id"], ["chat_messages.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["model_provider_id"], ["model_providers.id"], ondelete="SET NULL"),
    )
    op.create_index("ix_model_call_logs_status", "model_call_logs", ["status"])

    op.create_table(
        "system_logs",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("level", sa.String(length=20), nullable=False),
        sa.Column("event_type", sa.String(length=80), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("actor_user_id", sa.String(length=36), nullable=True),
        sa.Column("entity_type", sa.String(length=80), nullable=True),
        sa.Column("entity_id", sa.String(length=36), nullable=True),
        sa.Column("payload", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        *timestamps(),
        sa.ForeignKeyConstraint(["actor_user_id"], ["users.id"], ondelete="SET NULL"),
    )
    op.create_index("ix_system_logs_event_type", "system_logs", ["event_type"])


def downgrade() -> None:
    op.drop_index("ix_system_logs_event_type", table_name="system_logs")
    op.drop_table("system_logs")
    op.drop_index("ix_model_call_logs_status", table_name="model_call_logs")
    op.drop_table("model_call_logs")
    op.drop_table("rag_retrieval_logs")
    op.drop_index("ix_chat_messages_session_id", table_name="chat_messages")
    op.drop_table("chat_messages")
    op.drop_index("ix_document_chunks_knowledge_base_id", table_name="document_chunks")
    op.drop_table("document_chunks")
    op.drop_index("ix_chat_sessions_knowledge_base_id", table_name="chat_sessions")
    op.drop_table("chat_sessions")
    op.drop_table("prompt_versions")
    op.drop_index("ix_documents_status", table_name="documents")
    op.drop_index("ix_documents_knowledge_base_id", table_name="documents")
    op.drop_table("documents")
    op.drop_index("ix_prompt_templates_task_type", table_name="prompt_templates")
    op.drop_table("prompt_templates")
    op.drop_index("ix_model_providers_is_default", table_name="model_providers")
    op.drop_table("model_providers")
    op.drop_index("ix_knowledge_bases_status", table_name="knowledge_bases")
    op.drop_index("ix_knowledge_bases_workspace_id", table_name="knowledge_bases")
    op.drop_table("knowledge_bases")
    op.drop_table("users")
