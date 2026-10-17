from fastapi.testclient import TestClient

from app.main import create_app


def test_health_reports_ok() -> None:
    response = TestClient(create_app()).get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_openapi_schema_is_served() -> None:
    schema = TestClient(create_app()).get("/openapi.json").json()
    assert "/health" in schema["paths"]


def test_health_response_is_typed_in_the_openapi_schema() -> None:
    schema = TestClient(create_app()).get("/openapi.json").json()
    ok = schema["paths"]["/health"]["get"]["responses"]["200"]
    ref = ok["content"]["application/json"]["schema"]
    health = schema["components"]["schemas"][ref["$ref"].rsplit("/", 1)[-1]]
    assert health["properties"]["status"]["const"] == "ok"
    assert set(health["required"]) == {"status", "environment"}
