from sqlalchemy import inspect
from sqlalchemy.orm import Session

from app.db.base import Base
from app.models.knowledge_base import KnowledgeBase
from app.repositories.knowledge_bases import KnowledgeBaseRepository


def test_metadata_contains_mvp_tables() -> None:
    expected_tables = {
        "users",
        "knowledge_bases",
        "documents",
        "document_chunks",
        "prompt_templates",
        "prompt_versions",
        "chat_sessions",
        "chat_messages",
        "rag_retrieval_logs",
        "model_call_logs",
        "system_logs",
        "model_providers",
    }

    assert expected_tables.issubset(Base.metadata.tables.keys())


def test_sqlite_fixture_creates_core_tables(db_session: Session) -> None:
    table_names = set(inspect(db_session.bind).get_table_names())

    assert "knowledge_bases" in table_names
    assert "document_chunks" in table_names
    assert "model_providers" in table_names


def test_knowledge_base_repository_persists_entity(db_session: Session) -> None:
    repository = KnowledgeBaseRepository(db_session)

    knowledge_base = repository.add(
        KnowledgeBase(name="Enterprise Handbook", description="Internal policies"),
    )
    db_session.commit()

    found = repository.find_active_by_name("Enterprise Handbook", workspace_id="default")

    assert found is not None
    assert found.id == knowledge_base.id
    assert found.document_count == 0
