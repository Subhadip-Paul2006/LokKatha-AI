"""Database connection lifecycle helpers.

Responsible for initializing the Supabase client on application startup and
tearing it down on shutdown.  Called from the lifespan context manager.
"""

from __future__ import annotations

import logging

from supabase import Client

from app.core.config import Settings
from app.database.supabase import create_supabase_client

logger = logging.getLogger(__name__)


def init_database(settings: Settings) -> Client:
    """Create and return a Supabase client.

    Called during application startup.  The returned client is stored on
    ``app.state.supabase`` so repositories can access it via dependency
    injection.
    """
    client = create_supabase_client(settings)
    logger.info("Database connection established.")
    return client


def close_database(client: Client) -> None:
    """Perform any cleanup required when the application shuts down.

    The Supabase Python SDK manages its own httpx connection pool internally.
    This function exists as a hook for future cleanup (e.g. flushing caches,
    closing pooled connections) and to maintain a symmetrical init/close
    contract.
    """
    logger.info("Database connection closed.")
