"""Storage repository for handling file uploads and URL generation."""

from __future__ import annotations

import logging
import mimetypes
import uuid
from typing import IO, BinaryIO

from supabase import Client

from app.core.exceptions import FileTooLargeError, StorageError, UnsupportedFileTypeError

logger = logging.getLogger(__name__)


class StorageRepository:
    """Handles interactions with Supabase Storage for files (audio, images)."""

    ALLOWED_AUDIO_EXTENSIONS = {".wav", ".mp3", ".m4a", ".ogg"}
    ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

    MAX_AUDIO_SIZE_MB = 50.0
    MAX_IMAGE_SIZE_MB = 10.0

    def __init__(self, client: Client, bucket_name: str = "lokkatha-assets") -> None:
        """Initialize the repository with a Supabase client and target bucket."""
        self.client = client
        self.bucket = bucket_name

    def validate_audio(self, filename: str, file_size_bytes: int) -> None:
        """Validate audio file extension and size.

        Raises:
            UnsupportedFileTypeError: If the extension is not allowed.
            FileTooLargeError: If the size exceeds MAX_AUDIO_SIZE_MB.
        """
        ext = self._get_extension(filename)
        if ext not in self.ALLOWED_AUDIO_EXTENSIONS:
            raise UnsupportedFileTypeError(filename, list(self.ALLOWED_AUDIO_EXTENSIONS))

        size_mb = file_size_bytes / (1024 * 1024)
        if size_mb > self.MAX_AUDIO_SIZE_MB:
            raise FileTooLargeError(max_mb=int(self.MAX_AUDIO_SIZE_MB), actual_mb=size_mb)

    def validate_image(self, filename: str, file_size_bytes: int) -> None:
        """Validate image file extension and size.

        Raises:
            UnsupportedFileTypeError: If the extension is not allowed.
            FileTooLargeError: If the size exceeds MAX_IMAGE_SIZE_MB.
        """
        ext = self._get_extension(filename)
        if ext not in self.ALLOWED_IMAGE_EXTENSIONS:
            raise UnsupportedFileTypeError(filename, list(self.ALLOWED_IMAGE_EXTENSIONS))

        size_mb = file_size_bytes / (1024 * 1024)
        if size_mb > self.MAX_IMAGE_SIZE_MB:
            raise FileTooLargeError(max_mb=int(self.MAX_IMAGE_SIZE_MB), actual_mb=size_mb)

    async def upload_audio(self, file: IO[bytes] | BinaryIO, filename: str) -> str:
        """Upload an audio file and return its public URL.

        Raises:
            StorageError: If upload fails.
        """
        file.seek(0, 2)
        size = file.tell()
        file.seek(0)
        self.validate_audio(filename, size)

        return await self._upload_file(file, filename, "audio")

    async def upload_image(self, file: IO[bytes] | BinaryIO, filename: str) -> str:
        """Upload an image file and return its public URL.

        Raises:
            StorageError: If upload fails.
        """
        file.seek(0, 2)
        size = file.tell()
        file.seek(0)
        self.validate_image(filename, size)

        return await self._upload_file(file, filename, "images")

    async def delete_file(self, file_url: str) -> None:
        """Delete a file from storage given its public URL.

        Raises:
            StorageError: If deletion fails.
        """
        try:
            # Extract the path relative to the bucket from the public URL
            # Format: .../storage/v1/object/public/bucket_name/path/to/file
            path_segment = f"{self.bucket}/"
            if path_segment in file_url:
                file_path = file_url.split(path_segment, 1)[1]
            else:
                file_path = file_url # Fallback if URL structure differs

            response = self.client.storage.from_(self.bucket).remove([file_path])
            logger.info("Deleted file %s from bucket %s", file_path, self.bucket)
        except Exception as e:
            logger.error("Failed to delete file %s: %s", file_url, e)
            raise StorageError(f"Failed to delete file: {e}") from e

    def get_public_url(self, file_path: str) -> str:
        """Generate a public URL for a file path within the bucket."""
        return self.client.storage.from_(self.bucket).get_public_url(file_path)

    async def _upload_file(self, file: IO[bytes] | BinaryIO, filename: str, folder: str) -> str:
        """Helper to upload a file to a specific folder and return the URL."""
        ext = self._get_extension(filename)
        unique_filename = f"{uuid.uuid4()}{ext}"
        file_path = f"{folder}/{unique_filename}"
        
        content_type, _ = mimetypes.guess_type(filename)
        if not content_type:
            content_type = "application/octet-stream"

        try:
            # The python supabase client is synchronous for storage operations in some versions,
            # but we're designing this with async signatures for FastAPI compatibility.
            # Depending on the supabase client version, we might need to run this in a threadpool
            # if it's strictly sync, but the prompt says "Use async wherever supported."
            # The supabase-py library's storage client is mostly synchronous.
            file_bytes = file.read()
            
            response = self.client.storage.from_(self.bucket).upload(
                path=file_path,
                file=file_bytes,
                file_options={"content-type": content_type}
            )
            
            url = self.get_public_url(file_path)
            logger.info("Successfully uploaded %s to %s", filename, url)
            return url
        except Exception as e:
            logger.error("Failed to upload %s: %s", filename, e)
            raise StorageError(f"Failed to upload file {filename}: {e}") from e

    def _get_extension(self, filename: str) -> str:
        """Extract the extension from a filename in lowercase."""
        import os
        _, ext = os.path.splitext(filename)
        return ext.lower()
