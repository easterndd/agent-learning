from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.db.session import get_db_session
from app.main import create_app
from app.models.knowledge_base import KnowledgeBase
from app.repositories.knowledge_bases import KnowledgeBaseRepository


def override_db_session(db_session: Session):
    def _override():
        yield db_session

    return _override


def make_client(db_session: Session) -> TestClient:
    app = create_app(bootstrap_on_startup=False)
    app.dependency_overrides[get_db_session] = override_db_session(db_session)
    return TestClient(app)


def test_create_and_list_knowledge_base(db_session: Session) -> None:
    client = make_client(db_session)

    create_response = client.post(
        "/api/v1/knowledge-bases",
        json={"name": " Employee Handbook ", "description": "Policies"},
    )
    list_response = client.get("/api/v1/knowledge-bases")

    assert create_response.status_code == 201
    created = create_response.json()
    assert created["name"] == "Employee Handbook"
    assert created["description"] == "Policies"
    assert created["status"] == "active"
    assert list_response.status_code == 200
    assert [item["name"] for item in list_response.json()] == ["Employee Handbook"]


def test_active_name_must_be_unique_in_workspace(db_session: Session) -> None:
    client = make_client(db_session)
    client.post("/api/v1/knowledge-bases", json={"name": "Employee Handbook"})

    response = client.post("/api/v1/knowledge-bases", json={"name": "Employee Handbook"})

    assert response.status_code == 409


def test_soft_delete_hides_knowledge_base_and_allows_recreate(db_session: Session) -> None:
    client = make_client(db_session)
    created = client.post("/api/v1/knowledge-bases", json={"name": "Employee Handbook"}).json()

    delete_response = client.delete(f"/api/v1/knowledge-bases/{created['id']}")
    list_response = client.get("/api/v1/knowledge-bases")
    recreate_response = client.post("/api/v1/knowledge-bases", json={"name": "Employee Handbook"})

    deleted = db_session.get(KnowledgeBase, created["id"])
    assert delete_response.status_code == 204
    assert deleted is not None
    assert deleted.status == "deleted"
    assert list_response.json() == []
    assert recreate_response.status_code == 201


def test_update_checks_active_duplicate_name(db_session: Session) -> None:
    client = make_client(db_session)
    first = client.post("/api/v1/knowledge-bases", json={"name": "A"}).json()
    client.post("/api/v1/knowledge-bases", json={"name": "B"})

    response = client.patch(f"/api/v1/knowledge-bases/{first['id']}", json={"name": "B"})

    assert response.status_code == 409


def test_repository_scopes_active_names_by_workspace(db_session: Session) -> None:
    repository = KnowledgeBaseRepository(db_session)
    repository.add(KnowledgeBase(workspace_id="workspace-a", name="Handbook"))
    repository.add(KnowledgeBase(workspace_id="workspace-b", name="Handbook"))
    db_session.commit()

    assert repository.find_active_by_name("Handbook", workspace_id="workspace-a") is not None
    assert repository.find_active_by_name("Handbook", workspace_id="workspace-b") is not None
