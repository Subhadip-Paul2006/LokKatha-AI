"""Health check endpoint."""

from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/")
async def health_check() -> dict[str, str]:
    """Return service health status."""
    return {
        "status": "healthy",
        "project": "LokKatha AI",
    }
