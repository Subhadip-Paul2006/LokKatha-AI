"""Application settings loaded from environment variables."""

from functools import lru_cache
from typing import Literal

from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class Settings(BaseSettings):
    """Central configuration for the LokKatha AI backend."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ──────────────────────────────────────────────────────────
    app_name: str = Field(default="LokKatha AI", alias="APP_NAME")
    app_env: Literal["development", "staging", "production"] = Field(
        default="development",
        alias="APP_ENV",
    )
    debug: bool = Field(default=False, alias="DEBUG")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")

    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")

    cors_origins: str = Field(
        default="http://localhost:3000",
        alias="CORS_ORIGINS",
    )

    # ── Supabase ───────────────────────────────────────────────────────────────
    supabase_url: str = Field(default="", alias="SUPABASE_URL")
    supabase_anon_key: str = Field(default="", alias="SUPABASE_ANON_KEY")
    supabase_service_role_key: str = Field(
        default="",
        alias="SUPABASE_SERVICE_ROLE_KEY",
    )
    supabase_db_url: str = Field(default="", alias="SUPABASE_DB_URL")
    storage_bucket: str = Field(default="lokkatha-assets", alias="STORAGE_BUCKET")

    supported_languages: str = Field(
        default="bengali,hindi,english",
        alias="SUPPORTED_LANGUAGES",
    )

    # ── AI — Gemma 4 ───────────────────────────────────────────────────────────
    google_api_key: str = Field(default="", alias="GOOGLE_API_KEY")
    gemma_model: str = Field(default="gemma-4-31b-it", alias="GEMMA_MODEL")
    gemma_temperature: float = Field(default=0.4, alias="GEMMA_TEMPERATURE")
    gemma_max_retries: int = Field(default=3, alias="GEMMA_MAX_RETRIES")
    gemma_max_output_tokens: int = Field(default=8192, alias="GEMMA_MAX_OUTPUT_TOKENS")

    # ── AI — Whisper ───────────────────────────────────────────────────────────
    whisper_model: str = Field(default="large-v3", alias="WHISPER_MODEL")
    whisper_device: str = Field(default="cpu", alias="WHISPER_DEVICE")
    whisper_compute_type: str = Field(default="int8", alias="WHISPER_COMPUTE_TYPE")

    @property
    def cors_origin_list(self) -> list[str]:
        """Parse comma-separated CORS origins into a list."""
        return [
            origin.strip()
            for origin in self.cors_origins.split(",")
            if origin.strip()
        ]

    @property
    def supported_language_list(self) -> list[str]:
        """Parse comma-separated supported languages into a list."""
        return [
            lang.strip().lower()
            for lang in self.supported_languages.split(",")
            if lang.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance for dependency injection."""
    return Settings()
