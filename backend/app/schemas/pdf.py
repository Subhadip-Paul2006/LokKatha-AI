"""Pydantic schemas for the PDF ingestion pipeline.

These models define the API contract for the PDF upload endpoint.
They are intentionally separate from ``schemas/ai.py`` (AI processing)
and ``schemas/story.py`` (database entities).
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class PdfExtractionResult(BaseModel):
    """Internal result produced by ``PdfService.extract_text()``.

    Holds everything extracted from the PDF bytes before the API response
    is assembled.  Not exposed directly to clients.
    """

    text: str = Field(..., description="All extracted text, pages joined by newlines.")
    page_count: int = Field(..., ge=1, description="Total number of pages in the PDF.")
    char_count: int = Field(..., ge=0, description="Character count of the extracted text.")
    extraction_method: Literal["pymupdf", "tesseract_ocr"] = Field(
        ...,
        description="Which extraction strategy produced the result.",
    )
    ocr_unavailable: bool = Field(
        default=False,
        description=(
            "True when the document needed OCR but Tesseract was not installed. "
            "In this case ``text`` may be sparse or empty."
        ),
    )


class PdfUploadResponse(BaseModel):
    """Response returned by ``POST /api/v1/ingest/pdf``.

    Contains the Supabase Storage URL of the original file, extraction
    metadata, and the full extracted text.  No AI processing is applied.
    """

    file_url: str = Field(..., description="Public Supabase Storage URL of the uploaded PDF.")
    filename: str = Field(..., description="Original filename as uploaded.")
    size_bytes: int = Field(..., ge=1, description="File size in bytes.")
    page_count: int = Field(..., ge=1, description="Total number of pages.")
    extraction_method: Literal["pymupdf", "tesseract_ocr"] = Field(
        ...,
        description="Extraction strategy used: native text or OCR.",
    )
    extracted_text: str = Field(..., description="Full extracted text from all pages.")
    char_count: int = Field(..., ge=0, description="Character count of the extracted text.")
    ocr_unavailable: bool = Field(
        default=False,
        description="True when OCR was needed but Tesseract is not installed on this server.",
    )
