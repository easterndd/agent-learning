import logging

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.user import User
from app.repositories.users import UserRepository

logger = logging.getLogger(__name__)


def ensure_admin_user(session: Session) -> User:
    # 启动引导只保证“至少有一个管理员能登录”，不会覆盖已有账号。
    # TODO: 后续接入用户管理后，把初始化 admin 改成一次性 seed/migration 命令。
    repository = UserRepository(session)
    existing = repository.find_by_username_or_email(settings.admin_username)
    if existing is not None:
        return existing

    admin = repository.add(
        User(
            email=settings.admin_email,
            username=settings.admin_username,
            display_name=settings.admin_display_name,
            hashed_password=hash_password(settings.admin_password),
            role="admin",
            is_active=True,
        ),
    )
    session.commit()
    return admin


def bootstrap_database() -> None:
    # FastAPI lifespan 会调用这里。这里自己创建 session，避免把 Web 请求 session 混进启动流程。
    session = SessionLocal()
    try:
        ensure_admin_user(session)
    except SQLAlchemyError:
        session.rollback()
        logger.exception("Failed to bootstrap database")
        raise
    finally:
        session.close()
