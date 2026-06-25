from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.bootstrap import ensure_admin_user
from app.core.security import decode_access_token
from app.db.session import get_db_session
from app.main import create_app
from app.models.user import User
from app.repositories.users import UserRepository


def override_db_session(db_session: Session):
    def _override():
        yield db_session

    return _override


def test_ensure_admin_user_is_idempotent(db_session: Session) -> None:
    first = ensure_admin_user(db_session)
    second = ensure_admin_user(db_session)

    users = db_session.query(User).all()

    assert first.id == second.id
    assert len(users) == 1
    assert users[0].username == "admin"


def test_login_returns_jwt_for_admin(db_session: Session) -> None:
    admin = ensure_admin_user(db_session)
    app = create_app(bootstrap_on_startup=False)
    app.dependency_overrides[get_db_session] = override_db_session(db_session)

    client = TestClient(app)
    response = client.post("/api/v1/auth/login", json={"username": "admin", "password": "admin123456"})

    assert response.status_code == 200
    payload = response.json()
    token_payload = decode_access_token(payload["access_token"])

    assert payload["token_type"] == "bearer"
    assert payload["user_id"] == admin.id
    assert payload["username"] == "admin"
    assert token_payload is not None
    assert token_payload["sub"] == admin.id


def test_login_rejects_invalid_password(db_session: Session) -> None:
    ensure_admin_user(db_session)
    app = create_app(bootstrap_on_startup=False)
    app.dependency_overrides[get_db_session] = override_db_session(db_session)

    client = TestClient(app)
    response = client.post("/api/v1/auth/login", json={"username": "admin", "password": "wrong"})

    assert response.status_code == 401


def test_user_repository_finds_username_or_email(db_session: Session) -> None:
    ensure_admin_user(db_session)
    repository = UserRepository(db_session)

    assert repository.find_by_username_or_email("admin") is not None
    assert repository.find_by_username_or_email("admin@example.com") is not None
