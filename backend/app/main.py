from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.bootstrap import bootstrap_database
from app.core.config import settings


def create_app(*, bootstrap_on_startup: bool = True) -> FastAPI:
    lifespan = None
    if bootstrap_on_startup:

        @asynccontextmanager
        async def app_lifespan(_: FastAPI) -> AsyncIterator[None]:
            bootstrap_database()
            yield

        lifespan = app_lifespan

    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        openapi_url="/api/v1/openapi.json",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_url],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health", tags=["system"])
    def health() -> dict[str, str]:
        return {"status": "ok", "service": settings.app_name}

    app.include_router(api_router, prefix="/api/v1")
    return app


app = create_app()
