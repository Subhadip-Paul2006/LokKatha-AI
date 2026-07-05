"""PDF ingestion endpoint.

``POST /api/v1/ingest/pdf``

Accepts an administrator-uploaded PDF, validates it, stores the original file
in Supabase Storage (``books/`` folder), extracts all readable text using
``PdfService``, and returns the result.  No AI processing is applied.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, Request, UploadFile
from fastapi.responses import JSONResponse

from app.core.exceptions import FileValidationError, PdfExtractionError, StorageError
from app.database.repositories.storage_repository import StorageRepository
from app.schemas.pdf import PdfUploadResponse
from app.services.pdf_service import PdfService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ingest", tags=["Ingestion"])

# ── Constants ─────────────────────────────────────────────────────────────────

_PDF_CONTENT_TYPES = {"application/pdf", "application/x-pdf"}


# ── Endpoint ──────────────────────────────────────────────────────────────────


@router.post(
    "/pdf",
    response_model=PdfUploadResponse,
    summary="Upload and extract text from a Bengali PDF",
    description=(
        "Administrator endpoint. Accepts a single PDF file, validates it, "
        "stores the original in Supabase Storage, extracts all readable Bengali "
        "text via PyMuPDF (with Tesseract OCR fallback for scanned documents), "
        "and returns the extracted text. No AI processing is performed."
    ),
)
async def ingest_pdf(
    request: Request,
    file: UploadFile,
) -> PdfUploadResponse:
    """Accept a PDF upload and return extracted Bengali text.

    Args:
        request: FastAPI request — provides access to ``app.state``.
        file: The uploaded PDF (multipart/form-data).

    Returns:
        PdfUploadResponse containing the storage URL and extracted text.

    Raises:
        400: File is not a PDF, exceeds 100 MB, or cannot be opened.
        502: Supabase Storage upload failed.
        500: Unexpected internal error.
    """
    # ── 1. Basic content-type guard (MIME sniffing) ───────────────────────────
    content_type = (file.content_type or "").lower().split(";")[0].strip()
    if content_type and content_type not in _PDF_CONTENT_TYPES:
        logger.warning("Rejected upload with content-type: %s", content_type)
        return JSONResponse(
            status_code=400,
            content={
                "error": "Unsupported file type.",
                "detail": f"Expected application/pdf, got '{content_type}'.",
            },
        )

    filename = file.filename or "upload.pdf"
    logger.info("PDF ingestion started: %s", filename)

    # ── 2. Read file bytes (needed for both validation and extraction) ─────────
    pdf_bytes = await file.read()
    size_bytes = len(pdf_bytes)

    # ── 3. Validate via StorageRepository ────────────────────────────────────
    supabase_client = request.app.state.supabase
    settings = request.app.state.settings
    storage_repo = StorageRepository(
        client=supabase_client,
        bucket_name=settings.storage_bucket,
    )

    try:
        storage_repo.validate_pdf(filename, size_bytes)
    except FileValidationError as exc:
        logger.warning("PDF validation failed for '%s': %s", filename, exc.message)
        return JSONResponse(
            status_code=400,
            content={"error": exc.message, "detail": exc.detail},
        )

    # ── 4. Upload original PDF to Supabase Storage ────────────────────────────
    import io

    file_obj = io.BytesIO(pdf_bytes)
    try:
        file_url = await storage_repo.upload_pdf(file_obj, filename)
    except StorageError as exc:
        logger.error("Storage upload failed for '%s': %s", filename, exc.message)
        return JSONResponse(
            status_code=502,
            content={
                "error": "Storage upload failed.",
                "detail": exc.detail or exc.message,
            },
        )

    logger.info("PDF stored at: %s", file_url)

    # ── 5. Extract text ───────────────────────────────────────────────────────
    pdf_service = PdfService()
    try:
        extraction = await pdf_service.extract_text(pdf_bytes)
    except PdfExtractionError as exc:
        logger.error("PDF extraction failed for '%s': %s", filename, exc.message)
        return JSONResponse(
            status_code=400,
            content={
                "error": "PDF text extraction failed.",
                "detail": exc.detail or exc.message,
            },
        )

    logger.info(
        "Extraction complete — method: %s, chars: %d, pages: %d, ocr_unavailable: %s",
        extraction.extraction_method,
        extraction.char_count,
        extraction.page_count,
        extraction.ocr_unavailable,
    )

    return PdfUploadResponse(
        file_url=file_url,
        filename=filename,
        size_bytes=size_bytes,
        page_count=extraction.page_count,
        extraction_method=extraction.extraction_method,
        extracted_text=extraction.text,
        char_count=extraction.char_count,
        ocr_unavailable=extraction.ocr_unavailable,
    )
