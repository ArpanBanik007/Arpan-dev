"""
FastAPI Integration Tests for Chat and Status Endpoints.
Uses FastAPI TestClient to test endpoints, schemas, CORS, and validation.
Stage 3 of Arpan AI Portfolio RAG.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture(scope="module")
def client():
    """Module-scoped TestClient to avoid repeated lifespan startup costs."""
    with TestClient(app) as c:
        yield c


def test_root_endpoint(client: TestClient):
    """Verify root GET / returns project metadata and online status."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "project" in data
    assert data["docs"] == "/docs"


def test_health_endpoint(client: TestClient):
    """Verify GET /health returns 200 healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["collection"] == "portfolio_collection"


def test_portfolio_status_endpoint(client: TestClient):
    """Verify GET /api/v1/portfolio/status reports collection and document count."""
    response = client.get("/api/v1/portfolio/status")
    assert response.status_code == 200
    data = response.json()
    assert data["collection_name"] == "portfolio_collection"
    assert data["document_count"] >= 20
    assert data["status"] == "indexed"
    assert data["distance_metric"] == "cosine"


def test_chat_relevant_question(client: TestClient):
    """Verify POST /api/v1/chat answers relevant skills questions with grounded=True."""
    response = client.post(
        "/api/v1/chat",
        json={"question": "What are Arpan's technical skills?"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["grounded"] is True
    assert len(data["sources"]) > 0
    assert len(data["answer"]) > 20
    assert "react" in data["answer"].lower() or "python" in data["answer"].lower()


def test_chat_irrelevant_question_rejected(client: TestClient):
    """Verify POST /api/v1/chat rejects unrelated questions with grounded=False."""
    response = client.post(
        "/api/v1/chat",
        json={"question": "What is the capital of France?"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["grounded"] is False
    assert len(data["sources"]) == 0
    assert "outside that scope" in data["answer"].lower() or "portfolio" in data["answer"].lower()


def test_chat_empty_string_validation_error(client: TestClient):
    """Verify empty string question is rejected with 422 or 400."""
    response = client.post(
        "/api/v1/chat",
        json={"question": ""},
    )
    assert response.status_code in [400, 422]


def test_chat_whitespace_question_validation_error(client: TestClient):
    """Verify whitespace-only question is rejected with 400 or 422."""
    response = client.post(
        "/api/v1/chat",
        json={"question": "     "},
    )
    assert response.status_code in [400, 422]


def test_chat_missing_question_field(client: TestClient):
    """Verify missing question field returns 422 Unprocessable Entity."""
    response = client.post(
        "/api/v1/chat",
        json={},
    )
    assert response.status_code == 422


def test_openapi_schema_available(client: TestClient):
    """Verify OpenAPI JSON is generated and includes /api/v1/chat."""
    response = client.get("/openapi.json")
    assert response.status_code == 200
    data = response.json()
    assert "/api/v1/chat" in data["paths"]
    assert "/api/v1/portfolio/status" in data["paths"]
    assert "/health" in data["paths"]
