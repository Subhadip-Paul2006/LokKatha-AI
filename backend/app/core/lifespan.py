"""Application startup and shutdown lifecycle management."""

import logging
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import Settings

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Manage resources that must be initialized on startup and released on shutdown.

    Database pools, AI model clients, and storage connections will be wired here
    in later phases.
    """
    settings: Settings = app.state.settings

    logger.info("Starting %s [%s]", settings.app_name, settings.app_env)
    logger.info("Debug mode: %s", settings.debug)
    logger.info("CORS origins: %s", settings.cors_origin_list)

    yield

    logger.info("Shutting down %s", settings.app_name)
