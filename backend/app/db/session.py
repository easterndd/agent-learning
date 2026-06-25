from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

# pool_pre_ping 会在连接复用前探活，适合本地 Docker PostgreSQL 重启后的开发体验。
engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)


def get_db_session() -> Generator[Session, None, None]:
    # FastAPI dependency：每个请求拿一个 session，请求结束后关闭。
    # 提交/回滚由应用服务或路由显式控制，避免隐藏写入边界。
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
