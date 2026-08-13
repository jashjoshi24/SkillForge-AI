"""
Application configuration.

All secrets and environment-specific values come from environment variables
(loaded from `.env` in local development via python-dotenv / pydantic-settings).
Never hard-code credentials here.
"""
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Database (NeonDB / PostgreSQL) — required, no default on purpose so a
    # missing DATABASE_URL fails loudly instead of silently falling back to
    # a different database engine.
    DATABASE_URL: str = ""

    # AI provider — "anthropic" or "gemini" (see app/services/llm_client.py)
    AI_PROVIDER: str = "gemini"
    AI_API_KEY: str = ""
    AI_MODEL: str = "gemini-3.6-flash"

    # Auth (dev stub until Member 2's real Module A lands)
    JWT_SECRET: str = "change-me-in-production"
    AUTH_DEV_MODE: bool = True
    DEV_USER_EMAIL: str = "dev@skillforge.local"

    # App
    ENVIRONMENT: str = "development"
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    MAX_RESUME_FILE_SIZE_MB: int = 8
    LOG_LEVEL: str = "INFO"

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.FRONTEND_ORIGIN.split(",") if origin.strip()]

    @property
    def max_resume_file_size_bytes(self) -> int:
        return self.MAX_RESUME_FILE_SIZE_MB * 1024 * 1024


@lru_cache
def get_settings() -> Settings:
    return Settings()
