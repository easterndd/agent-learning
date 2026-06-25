from typing import Literal
from uuid import uuid4

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field, HttpUrl

router = APIRouter()

ProviderType = Literal["openai-compatible", "openai", "anthropic", "ollama", "custom"]
ProviderCapability = Literal["chat", "embedding", "rerank"]


class ModelProviderCreate(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    provider_type: ProviderType = "openai-compatible"
    base_url: HttpUrl | None = None
    api_key: str | None = Field(default=None, max_length=4096)
    chat_model: str = Field(min_length=1, max_length=120)
    embedding_model: str | None = Field(default=None, max_length=120)
    rerank_model: str | None = Field(default=None, max_length=120)
    capabilities: list[ProviderCapability] = Field(default_factory=lambda: ["chat"])
    is_default: bool = False
    timeout_seconds: int = Field(default=60, ge=1, le=600)


class ModelProviderUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=80)
    provider_type: ProviderType | None = None
    base_url: HttpUrl | None = None
    api_key: str | None = Field(default=None, max_length=4096)
    chat_model: str | None = Field(default=None, min_length=1, max_length=120)
    embedding_model: str | None = Field(default=None, max_length=120)
    rerank_model: str | None = Field(default=None, max_length=120)
    capabilities: list[ProviderCapability] | None = None
    timeout_seconds: int | None = Field(default=None, ge=1, le=600)


class ModelProviderSummary(BaseModel):
    id: str
    name: str
    provider_type: ProviderType
    base_url: str | None
    chat_model: str
    embedding_model: str | None
    rerank_model: str | None
    capabilities: list[ProviderCapability]
    is_default: bool
    timeout_seconds: int
    has_api_key: bool
    status: Literal["available", "not_configured"]


class ModelProviderStored(BaseModel):
    id: str
    name: str
    provider_type: ProviderType
    base_url: str | None = None
    api_key: str | None = None
    chat_model: str
    embedding_model: str | None = None
    rerank_model: str | None = None
    capabilities: list[ProviderCapability]
    is_default: bool = False
    timeout_seconds: int = 60


_providers: dict[str, ModelProviderStored] = {
    "mock-openai-compatible": ModelProviderStored(
        id="mock-openai-compatible",
        name="OpenAI Compatible Gateway",
        provider_type="openai-compatible",
        base_url="https://api.openai.com/v1",
        api_key=None,
        chat_model="gpt-4o-mini",
        embedding_model="text-embedding-3-small",
        capabilities=["chat", "embedding"],
        is_default=True,
        timeout_seconds=60,
    ),
    "local-ollama": ModelProviderStored(
        id="local-ollama",
        name="Local Ollama",
        provider_type="ollama",
        base_url="http://localhost:11434/v1",
        api_key=None,
        chat_model="qwen2.5:7b",
        embedding_model="nomic-embed-text",
        capabilities=["chat", "embedding"],
        is_default=False,
        timeout_seconds=120,
    ),
}


def _to_summary(provider: ModelProviderStored) -> ModelProviderSummary:
    return ModelProviderSummary(
        id=provider.id,
        name=provider.name,
        provider_type=provider.provider_type,
        base_url=provider.base_url,
        chat_model=provider.chat_model,
        embedding_model=provider.embedding_model,
        rerank_model=provider.rerank_model,
        capabilities=provider.capabilities,
        is_default=provider.is_default,
        timeout_seconds=provider.timeout_seconds,
        has_api_key=bool(provider.api_key),
        status="available" if provider.provider_type == "ollama" or provider.api_key else "not_configured",
    )


def get_default_model_provider() -> ModelProviderSummary:
    for provider in _providers.values():
        if provider.is_default:
            return _to_summary(provider)
    return _to_summary(next(iter(_providers.values())))


def _set_default(provider_id: str) -> None:
    for provider in _providers.values():
        provider.is_default = provider.id == provider_id


@router.get("", response_model=list[ModelProviderSummary])
def list_model_providers() -> list[ModelProviderSummary]:
    return [_to_summary(provider) for provider in _providers.values()]


@router.post("", response_model=ModelProviderSummary, status_code=status.HTTP_201_CREATED)
def create_model_provider(payload: ModelProviderCreate) -> ModelProviderSummary:
    provider_id = str(uuid4())
    provider = ModelProviderStored(
        id=provider_id,
        name=payload.name,
        provider_type=payload.provider_type,
        base_url=str(payload.base_url) if payload.base_url else None,
        api_key=payload.api_key,
        chat_model=payload.chat_model,
        embedding_model=payload.embedding_model,
        rerank_model=payload.rerank_model,
        capabilities=payload.capabilities,
        is_default=payload.is_default,
        timeout_seconds=payload.timeout_seconds,
    )
    _providers[provider_id] = provider
    if payload.is_default:
        _set_default(provider_id)
    return _to_summary(provider)


@router.patch("/{provider_id}", response_model=ModelProviderSummary)
def update_model_provider(provider_id: str, payload: ModelProviderUpdate) -> ModelProviderSummary:
    provider = _providers.get(provider_id)
    if provider is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Model provider not found")

    update = payload.model_dump(exclude_unset=True)
    if "base_url" in update and update["base_url"] is not None:
        update["base_url"] = str(update["base_url"])
    for key, value in update.items():
        setattr(provider, key, value)
    return _to_summary(provider)


@router.post("/{provider_id}/activate", response_model=ModelProviderSummary)
def activate_model_provider(provider_id: str) -> ModelProviderSummary:
    provider = _providers.get(provider_id)
    if provider is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Model provider not found")
    _set_default(provider_id)
    return _to_summary(provider)
