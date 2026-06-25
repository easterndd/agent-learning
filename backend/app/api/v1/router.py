from fastapi import APIRouter

from app.modules.auth.api.router import router as auth_router
from app.modules.documents.api.router import router as documents_router
from app.modules.knowledge_bases.api.router import router as knowledge_bases_router
from app.modules.logs.api.router import router as logs_router
from app.modules.model_providers.api.router import router as model_providers_router
from app.modules.prompts.api.router import router as prompts_router
from app.modules.rag.api.router import router as rag_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(knowledge_bases_router, prefix="/knowledge-bases", tags=["knowledge-bases"])
api_router.include_router(documents_router, prefix="/documents", tags=["documents"])
api_router.include_router(rag_router, prefix="/rag", tags=["rag"])
api_router.include_router(prompts_router, prefix="/prompts", tags=["prompts"])
api_router.include_router(logs_router, prefix="/logs", tags=["logs"])
api_router.include_router(model_providers_router, prefix="/model-providers", tags=["model-providers"])
