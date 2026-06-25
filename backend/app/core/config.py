from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = "local"
    app_name: str = "Enterprise AI Copilot Lab"
    frontend_url: str = "http://localhost:3000"
    default_workspace_id: str = "default"

    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "agent_learning"
    postgres_user: str = "agent_learning"
    postgres_password: str = "agent_learning"

    redis_url: str = "redis://localhost:6379/0"
    qdrant_url: str = "http://localhost:6333"

    jwt_secret_key: str = Field(default="change-me-in-local-env")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    admin_username: str = "admin"
    admin_email: str = "admin@example.com"
    admin_password: str = "admin123456"
    admin_display_name: str = "Administrator"

    llm_provider: str = "mock"
    embedding_provider: str = "mock"

    @property
    def database_url(self) -> str:
        return (
            "postgresql+psycopg://"
            f"{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
