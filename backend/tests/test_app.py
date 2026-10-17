from fastapi.testclient import TestClient

from app.main import create_app


def test_health_reports_ok() -> None:
    response = TestClient(create_app()).get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_openapi_schema_is_served() -> None:
    schema = TestClient(create_app()).get("/openapi.json").json()
    assert "/health" in schema["paths"]
