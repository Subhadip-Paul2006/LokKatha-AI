"""Service-layer protocols for replaceable AI providers."""

from __future__ import annotations

from pathlib import Path
from typing import Protocol

from app.schemas.ai import (
    ArchiveChatInput,
    ArchiveChatOutput,
    PipelineResult,
    ProcessedStoryOutput,
    StoryProcessingInput,
    TranscriptionResult,
)


class TranscriptionProvider(Protocol):
    """Contract for speech-to-text engines (Whisper or future replacements)."""

    async def transcribe(self, audio_path: Path) -> TranscriptionResult:
        """Transcribe an audio file and return text with language metadata."""
        ...


class StoryProcessor(Protocol):
    """Contract for LLM story-processing engines (Gemma or future replacements)."""

    async def process_story(self, story_input: StoryProcessingInput) -> ProcessedStoryOutput:
        """Run unified story analysis and return structured JSON."""
        ...


class ArchiveChatProvider(Protocol):
    """Contract for archive Q&A engines."""

    async def chat_archive(self, chat_input: ArchiveChatInput) -> ArchiveChatOutput:
        """Answer a visitor question grounded in supplied archive context."""
        ...


class AudioPipelineProvider(Protocol):
    """Contract for the end-to-end audio processing pipeline."""

    async def process_audio(self, audio_path: Path, **kwargs) -> PipelineResult:
        """Run audio through transcription and story processing."""
        ...
