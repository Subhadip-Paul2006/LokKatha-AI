"""Whisper integration for speech-to-text processing."""

import asyncio
import logging
from pathlib import Path
from typing import Any

from faster_whisper import WhisperModel

from app.core.config import get_settings
from app.schemas.ai import TranscriptionResult

logger = logging.getLogger(__name__)


class WhisperService:
    """Service for transcribing audio using faster-whisper.
    
    Implements the TranscriptionProvider protocol.
    """

    def __init__(self) -> None:
        """Initialize the Whisper model."""
        self._settings = get_settings()
        
        logger.info(
            "Initializing Whisper model '%s' on device '%s' with compute type '%s'",
            self._settings.whisper_model,
            self._settings.whisper_device,
            self._settings.whisper_compute_type,
        )
        
        # Load the model synchronously on startup or lazy load.
        # Here we lazy load inside the init.
        self._model = WhisperModel(
            model_size_or_path=self._settings.whisper_model,
            device=self._settings.whisper_device,
            compute_type=self._settings.whisper_compute_type,
        )

    def _transcribe_sync(self, audio_path: Path) -> TranscriptionResult:
        """Synchronous method to run the compute-bound transcription."""
        logger.info("Transcribing audio file: %s", audio_path)
        
        # We assume no language is passed initially so it auto-detects,
        # but could be extended to take an optional language parameter.
        segments, info = self._model.transcribe(
            str(audio_path),
            beam_size=5,
            vad_filter=True,
        )
        
        # segments is a generator; we must iterate to actually process the audio
        transcript_text = " ".join([segment.text for segment in segments]).strip()
        
        result = TranscriptionResult(
            transcript=transcript_text,
            language=info.language,
            confidence=info.language_probability,
        )
        logger.info(
            "Transcription complete: %s (confidence: %.2f)",
            result.language,
            result.confidence,
        )
        return result

    async def transcribe(self, audio_path: Path) -> TranscriptionResult:
        """Transcribe an audio file and return text with language metadata.
        
        Offloads the compute-bound faster-whisper execution to a separate thread
        to avoid blocking the FastAPI asyncio event loop.
        """
        if not audio_path.is_file():
            raise FileNotFoundError(f"Audio file not found: {audio_path}")
            
        return await asyncio.to_thread(self._transcribe_sync, audio_path)


def get_whisper_service() -> WhisperService:
    """Dependency provider for WhisperService."""
    # Note: In a true production app, you might want to cache this 
    # to avoid reloading the model per request, e.g., using @lru_cache.
    return WhisperService()
