"""Audio-to-Story processing pipeline orchestration."""

import logging
from pathlib import Path

from app.schemas.ai import AudioProcessingInput, PipelineResult, StoryProcessingInput
from app.services.protocols import AudioPipelineProvider, StoryProcessor, TranscriptionProvider

logger = logging.getLogger(__name__)


class PipelineService:
    """Orchestrates the end-to-end processing of audio to structured cultural data.
    
    Implements the AudioPipelineProvider protocol.
    """

    def __init__(
        self,
        transcription_provider: TranscriptionProvider,
        story_processor: StoryProcessor,
    ) -> None:
        """Inject dependencies for audio and LLM processing."""
        self._transcription_provider = transcription_provider
        self._story_processor = story_processor

    async def process_audio(self, input_data: AudioProcessingInput) -> PipelineResult:
        """Run audio through transcription and story processing.
        
        Args:
            input_data: The audio file path and associated metadata.
            
        Returns:
            PipelineResult: Combined transcription and structured story output.
        """
        logger.info(
            "Starting audio pipeline for speaker '%s', location '%s'", 
            input_data.speaker.name,
            input_data.location.district,
        )

        # 1. Transcribe the audio
        transcription = await self._transcription_provider.transcribe(input_data.audio_path)
        
        logger.info(
            "Transcription completed successfully. Language detected: %s",
            transcription.language,
        )

        # Allow user to override detected language if necessary
        final_language = input_data.language or transcription.language

        # 2. Prepare data for the Story Processor
        story_input = StoryProcessingInput(
            transcript=transcription.transcript,
            language=final_language,
            speaker=input_data.speaker,
            location=input_data.location,
            metadata=input_data.metadata,
        )

        # 3. Process the story and extract cultural context
        processed_story = await self._story_processor.process_story(story_input)
        
        logger.info("Pipeline completed successfully for: %s", processed_story.title)

        return PipelineResult(
            transcription=transcription,
            processed_story=processed_story,
        )


def get_pipeline_service() -> PipelineService:
    """Dependency provider for PipelineService.
    
    Wires up the default implementations for the application.
    """
    from app.services.gemma_service import get_gemma_service
    from app.services.whisper_service import get_whisper_service
    
    return PipelineService(
        transcription_provider=get_whisper_service(),
        story_processor=get_gemma_service(),
    )
