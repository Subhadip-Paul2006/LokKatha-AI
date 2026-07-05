"""Application startup and shutdown lifecycle management."""

import logging
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import Settings
from app.database.connection import close_database, init_database

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Manage resources that must be initialised on startup and released on shutdown.

    Startup order
    -------------
    1. Database (Supabase)      — Phase 02
    2. GemmaService             — Phase 03  (Google GenAI client, prompt templates)
    3. WhisperService           — Phase 03  (faster-whisper model load)

    All services are stored on ``app.state`` so FastAPI dependency-injection
    functions can retrieve them without importing global singletons.
    """
    settings: Settings = app.state.settings

    logger.info("Starting %s [%s]", settings.app_name, settings.app_env)
    logger.info("Debug mode: %s", settings.debug)
    logger.info("CORS origins: %s", settings.cors_origin_list)

    # ── 1. Database ───────────────────────────────────────────────────────────
    supabase_client = init_database(settings)
    app.state.supabase = supabase_client

    # ── 2. Gemma Service ─────────────────────────────────────────────────────
    # Import locally to keep startup failures isolated and traceable.
    from app.services.gemma_service import GemmaService

    gemma_service = GemmaService()
    app.state.gemma = gemma_service
    logger.info(
        "GemmaService ready — model: %s, temperature: %s",
        settings.gemma_model,
        settings.gemma_temperature,
    )

    # ── 3. Whisper Service ───────────────────────────────────────────────────
    # WhisperModel.__init__ downloads / loads the model weights synchronously.
    # We accept the blocking startup cost to ensure the model is hot for the
    # first request. This is the standard pattern for ML-serving applications.
    from app.services.whisper_service import WhisperService

    whisper_service = WhisperService()
    app.state.whisper = whisper_service
    logger.info(
        "WhisperService ready — model: %s, device: %s, compute: %s",
        settings.whisper_model,
        settings.whisper_device,
        settings.whisper_compute_type,
    )

    logger.info("All services initialised. %s is ready to accept requests.", settings.app_name)

    yield

    # ── Shutdown ─────────────────────────────────────────────────────────────
    logger.info("Shutting down %s", settings.app_name)
    close_database(supabase_client)
    logger.info("All resources released.")
