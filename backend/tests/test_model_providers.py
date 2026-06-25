from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_list_model_providers_hides_api_key() -> None:
    response = client.get("/api/v1/model-providers")

    assert response.status_code == 200
    providers = response.json()
    assert providers
    assert "api_key" not in providers[0]
    assert "has_api_key" in providers[0]


def test_create_and_activate_custom_model_provider() -> None:
    create_response = client.post(
        "/api/v1/model-providers",
        json={
            "name": "DMXAPI Gateway",
            "provider_type": "openai-compatible",
            "base_url": "https://www.dmxapi.cn/v1",
            "api_key": "sk-test",
            "chat_model": "deepseek-chat",
            "embedding_model": "BAAI/bge-m3",
            "capabilities": ["chat", "embedding"],
        },
    )

    assert create_response.status_code == 201
    created = create_response.json()
    assert created["has_api_key"] is True
    assert "api_key" not in created

    activate_response = client.post(f"/api/v1/model-providers/{created['id']}/activate")

    assert activate_response.status_code == 200
    assert activate_response.json()["is_default"] is True


def test_rag_response_includes_default_model_provider() -> None:
    response = client.post(
        "/api/v1/rag/ask",
        json={"knowledge_base_id": "kb-1", "question": "年假政策是什么？"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["model_provider_id"]
    assert payload["model_name"]
