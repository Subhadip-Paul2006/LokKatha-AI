"""FastAPI application factory and entry point."""

import logging

from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import Settings, get_settings
from app.core.cors import configure_cors
from app.core.lifespan import lifespan
from app.core.logging import setup_logging

logger = logging.getLogger(__name__)


def create_app(settings: Settings | None = None) -> FastAPI:
    """
    Build and configure the FastAPI application.

    Uses the factory pattern so tests and scripts can inject custom settings.
    """
    if settings is None:
        settings = get_settings()

    setup_logging(settings.log_level)

    app = FastAPI(
        title=settings.app_name,
        description="AI-powered cultural preservation platform for India's oral heritage.",
        version="0.1.0",
        debug=settings.debug,
        lifespan=lifespan,
    )

    app.state.settings = settings

    configure_cors(app, settings)
    app.include_router(api_router)

    logger.info("Application initialized: %s", settings.app_name)

    return app


app = create_app()
