"""Custom exception hierarchy for the LokKatha AI backend.

All application-specific exceptions inherit from LokKathaError so callers
can catch broad or narrow as needed.  Every exception carries a human-readable
message and an optional detail payload for structured error responses.
"""

from __future__ import annotations


class LokKathaError(Exception):
    """Base exception for all LokKatha AI backend errors."""

    def __init__(self, message: str = "An unexpected error occurred.", *, detail: str | None = None) -> None:
        self.message = message
        self.detail = detail
        super().__init__(self.message)


# ── Database / Repository Errors ──────────────────────────────────────────────


class DatabaseError(LokKathaError):
    """Raised when a database operation fails."""

    def __init__(self, message: str = "Database operation failed.", *, detail: str | None = None) -> None:
        super().__init__(message, detail=detail)


class RecordNotFoundError(DatabaseError):
    """Raised when a requested record does not exist."""

    def __init__(self, entity: str = "Record", entity_id: str = "") -> None:
        msg = f"{entity} not found."
        if entity_id:
            msg = f"{entity} with id '{entity_id}' not found."
        super().__init__(msg)


class DuplicateRecordError(DatabaseError):
    """Raised when an insert would violate a uniqueness constraint."""

    def __init__(self, message: str = "A record with this identifier already exists.") -> None:
        super().__init__(message)


# ── Storage Errors ────────────────────────────────────────────────────────────


class StorageError(LokKathaError):
    """Raised when a storage operation (upload, delete, URL generation) fails."""

    def __init__(self, message: str = "Storage operation failed.", *, detail: str | None = None) -> None:
        super().__init__(message, detail=detail)


class FileValidationError(StorageError):
    """Raised when an uploaded file fails type, size, or integrity checks."""

    def __init__(self, message: str = "File validation failed.") -> None:
        super().__init__(message)


class FileTooLargeError(FileValidationError):
    """Raised when an uploaded file exceeds the size limit."""

    def __init__(self, max_mb: int, actual_mb: float) -> None:
        super().__init__(f"File size ({actual_mb:.1f} MB) exceeds the {max_mb} MB limit.")


class UnsupportedFileTypeError(FileValidationError):
    """Raised when the uploaded file has a disallowed MIME type or extension."""

    def __init__(self, filename: str, allowed: list[str]) -> None:
        allowed_str = ", ".join(allowed)
        super().__init__(f"File '{filename}' has an unsupported type. Allowed: {allowed_str}.")


# ── Configuration Errors ──────────────────────────────────────────────────────


class ConfigurationError(LokKathaError):
    """Raised when a required configuration value is missing or invalid."""

    def __init__(self, message: str = "Configuration error.") -> None:
        super().__init__(message)
