"""Supabase client factory.

Provides a single, reusable Supabase client initialized from environment
settings.  The client is created once on application startup via the lifespan
hook and stored on ``app.state`` for dependency injection.

Uses the **service-role key** (not the anon key) because backend operations
need unrestricted access to storage buckets and database tables.
"""

from __future__ import annotations

import logging

from supabase import Client, create_client

from app.core.config import Settings
from app.core.exceptions import ConfigurationError

logger = logging.getLogger(__name__)


def create_supabase_client(settings: Settings) -> Client:
    """Build a Supabase client from application settings.

    Raises:
        ConfigurationError: If the Supabase URL or service-role key is empty.
    """
    if not settings.supabase_url:
        raise ConfigurationError("SUPABASE_URL is not configured.")
    if not settings.supabase_service_role_key:
        raise ConfigurationError("SUPABASE_SERVICE_ROLE_KEY is not configured.")

    client = create_client(
        supabase_url=settings.supabase_url,
        supabase_key=settings.supabase_service_role_key,
    )

    logger.info("Supabase client initialized for %s", settings.supabase_url)
    return client
