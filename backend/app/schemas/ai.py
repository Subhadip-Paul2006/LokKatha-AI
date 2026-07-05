"""Pydantic schemas for the AI processing layer.

These models are independent of database persistence schemas in ``story.py``.
They define the contract between Whisper, Gemma, and the processing pipeline.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from pydantic import BaseModel, Field


class SpeakerInfo(BaseModel):
    """Metadata about the storyteller."""

    name: str = Field(..., min_length=1, max_length=200)
    age: int | None = Field(default=None, ge=1, le=150)
    occupation: str | None = Field(default=None, max_length=200)


class LocationInfo(BaseModel):
    """Geographic context for a recorded story."""

    village: str | None = Field(default=None, max_length=200)
    district: str = Field(..., min_length=1, max_length=200)
    state: str = Field(default="West Bengal", max_length=100)
    country: str = Field(default="India", max_length=100)


class StoryProcessingInput(BaseModel):
    """Input payload for the unified Gemma story-processing function."""

    transcript: str = Field(..., min_length=1)
    language: str = Field(..., min_length=1, max_length=50)
    speaker: SpeakerInfo
    location: LocationInfo
    metadata: dict[str, str] = Field(default_factory=dict)


class StoryTranslations(BaseModel):
    """Multilingual translations produced in a single Gemma response."""

    english: str = Field(..., min_length=1)
    bengali: str = Field(..., min_length=1)
    hindi: str = Field(..., min_length=1)


class ProcessedStoryOutput(BaseModel):
    """Structured output from a single Gemma processing call."""

    title: str = Field(..., min_length=1, max_length=500)
    summary: str = Field(..., min_length=1)
    translations: StoryTranslations
    keywords: list[str] = Field(..., min_length=1)
    cultural_tags: list[str] = Field(..., min_length=1)
    historical_importance: str = Field(..., min_length=1)
    suggested_questions: list[str] = Field(..., min_length=1)
    story: str = Field(..., min_length=1)


class TranscriptionResult(BaseModel):
    """Output from the Whisper speech-recognition service."""

    transcript: str = Field(..., min_length=1)
    language: str = Field(..., min_length=1, max_length=50)
    confidence: float = Field(..., ge=0.0, le=1.0)


class PipelineResult(BaseModel):
    """Combined result of the full audio-to-structured-JSON pipeline."""

    transcription: TranscriptionResult
    processed_story: ProcessedStoryOutput


class ArchiveChatInput(BaseModel):
    """Input for archive Q&A (RAG-ready, context supplied by caller)."""

    question: str = Field(..., min_length=1)
    context: str = Field(..., min_length=1)
    metadata: dict[str, Any] = Field(default_factory=dict)


class ArchiveChatOutput(BaseModel):
    """Structured response for archive chat interactions."""

    title: str = Field(..., min_length=1)
    location: str = Field(..., min_length=1)
    answer: str = Field(..., min_length=1)
    excerpt: str = Field(default="")
    keywords: list[str] = Field(default_factory=list)
    related_questions: list[str] = Field(default_factory=list)


class AudioProcessingInput(BaseModel):
    """Full pipeline input: audio file path plus story metadata."""

    audio_path: Path
    speaker: SpeakerInfo
    location: LocationInfo
    language: str | None = Field(
        default=None,
        description="Optional language override; Whisper auto-detects when omitted.",
    )
    metadata: dict[str, str] = Field(default_factory=dict)
