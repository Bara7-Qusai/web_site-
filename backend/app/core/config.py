from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Process configuration, read from ``PHARMACY_*`` environment variables."""

    model_config = SettingsConfigDict(env_prefix="PHARMACY_", env_file=".env", extra="ignore")

    environment: str = "development"
    database_url: str = "postgresql+psycopg://pharmacy:pharmacy@localhost:5432/pharmacy"


@lru_cache
def get_settings() -> Settings:
    return Settings()
