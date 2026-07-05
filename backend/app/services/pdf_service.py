"""PDF text extraction service using PyMuPDF with Tesseract OCR fallback.

Extraction strategy
-------------------
1. **PyMuPDF fast path** — reads the embedded character stream directly from
   the PDF.  This is instant and perfectly accurate for text-bearing PDFs.
2. **Tesseract OCR fallback** — if the total extracted text is shorter than
   ``MIN_TEXT_LENGTH`` characters the document is assumed to be image-only
   (e.g. a scanned book).  Each page is rendered to a PIL image at 200 DPI
   and fed to Tesseract with the Bengali (``ben``) language model.
3. **Graceful degradation** — if Tesseract is not installed on the host OS,
   ``ocr_unavailable=True`` is set in the result rather than raising an error.
   The sparse PyMuPDF output (if any) is returned so the API never hard-fails
   due to a missing OS dependency.
"""

from __future__ import annotations

import asyncio
import logging
from io import BytesIO

import fitz  # PyMuPDF

from app.core.exceptions import PdfExtractionError
from app.schemas.pdf import PdfExtractionResult

logger = logging.getLogger(__name__)

# If extracted text per document is shorter than this we assume image-only.
_MIN_TEXT_LENGTH: int = 50

# Tesseract language string for Bengali.
_TESSERACT_LANG: str = "ben"

# DPI for rendering pages to images for OCR.
_OCR_DPI: int = 200


class PdfService:
    """Extracts readable text from PDF bytes.

    Implements the ``TranscriptionProvider``-style contract: one public async
    method that accepts raw bytes and returns a validated result object.
    """

    # ── Public API ────────────────────────────────────────────────────────────

    async def extract_text(self, pdf_bytes: bytes) -> PdfExtractionResult:
        """Extract all readable text from a PDF.

        Runs the CPU-bound work on a thread pool to avoid blocking the
        asyncio event loop.

        Args:
            pdf_bytes: Raw bytes of the uploaded PDF.

        Returns:
            PdfExtractionResult with text, page count, extraction method,
            char count, and whether OCR was unavailable.

        Raises:
            PdfExtractionError: If the bytes cannot be opened as a PDF.
        """
        return await asyncio.to_thread(self._extract_sync, pdf_bytes)

    # ── Synchronous helpers (run inside thread pool) ──────────────────────────

    def _extract_sync(self, pdf_bytes: bytes) -> PdfExtractionResult:
        """Synchronous extraction — called from a thread by ``extract_text``."""
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        except Exception as exc:
            raise PdfExtractionError(
                "Unable to open the uploaded file as a PDF.",
                detail=str(exc),
            ) from exc

        page_count = len(doc)
        logger.info("Opened PDF: %d pages", page_count)

        # ── Step 1: PyMuPDF embedded-text extraction ──────────────────────────
        pymupdf_text = self._extract_pymupdf(doc)

        if len(pymupdf_text.strip()) >= _MIN_TEXT_LENGTH:
            logger.info(
                "PyMuPDF extraction succeeded: %d chars across %d pages.",
                len(pymupdf_text),
                page_count,
            )
            doc.close()
            return PdfExtractionResult(
                text=pymupdf_text.strip(),
                page_count=page_count,
                char_count=len(pymupdf_text.strip()),
                extraction_method="pymupdf",
            )

        # ── Step 2: Tesseract OCR fallback ────────────────────────────────────
        logger.info(
            "PyMuPDF returned only %d chars — attempting Tesseract OCR.",
            len(pymupdf_text.strip()),
        )
        ocr_text, ocr_available = self._extract_tesseract(doc)
        doc.close()

        if not ocr_available:
            # Tesseract not installed: return sparse PyMuPDF output gracefully.
            logger.warning(
                "Tesseract OCR is not available on this host. "
                "Returning partial PyMuPDF output (%d chars).",
                len(pymupdf_text.strip()),
            )
            return PdfExtractionResult(
                text=pymupdf_text.strip(),
                page_count=page_count,
                char_count=len(pymupdf_text.strip()),
                extraction_method="pymupdf",
                ocr_unavailable=True,
            )

        logger.info(
            "Tesseract OCR extraction succeeded: %d chars across %d pages.",
            len(ocr_text),
            page_count,
        )
        return PdfExtractionResult(
            text=ocr_text.strip(),
            page_count=page_count,
            char_count=len(ocr_text.strip()),
            extraction_method="tesseract_ocr",
        )

    # ── Extraction helpers ─────────────────────────────────────────────────────

    @staticmethod
    def _extract_pymupdf(doc: fitz.Document) -> str:
        """Extract embedded text from every page using PyMuPDF.

        Returns all page text joined by a newline separator.
        """
        pages: list[str] = []
        for page in doc:
            text = page.get_text("text")  # type: ignore[attr-defined]
            pages.append(text)
        return "\n".join(pages)

    @staticmethod
    def _extract_tesseract(doc: fitz.Document) -> tuple[str, bool]:
        """Render each page to an image and run Tesseract OCR.

        Returns:
            A tuple of ``(extracted_text, tesseract_available)``.
            ``tesseract_available`` is False when the pytesseract wrapper or
            the Tesseract binary is not found — callers must handle this case.
        """
        try:
            import pytesseract
            from PIL import Image
        except ImportError:
            logger.warning("pytesseract or Pillow is not installed.")
            return "", False

        # Verify the Tesseract binary is reachable before iterating all pages.
        try:
            pytesseract.get_tesseract_version()
        except pytesseract.TesseractNotFoundError:
            logger.warning(
                "Tesseract binary not found on PATH. "
                "Install Tesseract and the 'ben' language pack for OCR support."
            )
            return "", False

        zoom = _OCR_DPI / 72  # 72 DPI is the default PDF point resolution
        matrix = fitz.Matrix(zoom, zoom)

        pages: list[str] = []
        for page_num, page in enumerate(doc, start=1):
            # Render the page to a pixmap, then convert to PIL Image for Tesseract.
            pixmap = page.get_pixmap(matrix=matrix, alpha=False)  # type: ignore[attr-defined]
            img_bytes = pixmap.tobytes("png")
            pil_image = Image.open(BytesIO(img_bytes))

            page_text: str = pytesseract.image_to_string(
                pil_image,
                lang=_TESSERACT_LANG,
                config="--psm 6",  # Assume a uniform block of text
            )
            pages.append(page_text)
            logger.debug("OCR page %d: %d chars extracted.", page_num, len(page_text))

        return "\n".join(pages), True


def get_pdf_service() -> PdfService:
    """Dependency provider for PdfService."""
    return PdfService()
