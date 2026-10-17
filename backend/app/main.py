from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel

from app.core.config import get_settings


class HealthResponse(BaseModel):
    status: Literal["ok"]
    environment: str


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="Pharmacy Management System", version="0.1.0")

    @app.get("/health", tags=["system"], summary="Liveness probe")
    def health() -> HealthResponse:
        return HealthResponse(status="ok", environment=settings.environment)

    return app


app = create_app()
