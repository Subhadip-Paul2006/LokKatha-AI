"""Aggregate API routers."""

from fastapi import APIRouter

from app.api.v1 import health, ingest

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(ingest.router, prefix="/api/v1")
