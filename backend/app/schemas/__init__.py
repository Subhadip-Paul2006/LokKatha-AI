"""Pydantic request and response schemas."""

from app.schemas.ai import (
    ArchiveChatInput,
    ArchiveChatOutput,
    AudioProcessingInput,
    LocationInfo,
    PipelineResult,
    ProcessedStoryOutput,
    SpeakerInfo,
    StoryProcessingInput,
    StoryTranslations,
    TranscriptionResult,
)
from app.schemas.pdf import PdfExtractionResult, PdfUploadResponse

__all__ = [
    "ArchiveChatInput",
    "ArchiveChatOutput",
    "AudioProcessingInput",
    "LocationInfo",
    "PdfExtractionResult",
    "PdfUploadResponse",
    "PipelineResult",
    "ProcessedStoryOutput",
    "SpeakerInfo",
    "StoryProcessingInput",
    "StoryTranslations",
    "TranscriptionResult",
]

