"""Google Gemma 4 integration for processing stories and chat."""

import asyncio
import logging
from typing import Any

from google import genai
from google.genai import types

from app.core.config import get_settings
from app.core.exceptions import JSONValidationError
from app.schemas.ai import (
    ArchiveChatInput,
    ArchiveChatOutput,
    ProcessedStoryOutput,
    StoryProcessingInput,
)
from app.utils.json_parser import parse_llm_json
from app.utils.prompt_loader import get_prompt_loader

logger = logging.getLogger(__name__)


class GemmaService:
    """Service for processing cultural stories using Google Gemma 4.
    
    Implements the StoryProcessor and ArchiveChatProvider protocols.
    """

    def __init__(self) -> None:
        self._settings = get_settings()
        self._prompt_loader = get_prompt_loader()
        
        # Initialize Google GenAI client
        self._client = genai.Client(api_key=self._settings.google_api_key)
        
        # Load common prompt rules dynamically
        self._prompt_rules = self._prompt_loader.load("prompt_rules.txt")
        self._translation_rules = self._prompt_loader.load("translation_rules.txt")

    async def _generate_with_retry(self, prompt: str, schema_model: Any) -> Any:
        """Generate content with the LLM and parse the JSON response with retries."""
        max_retries = self._settings.gemma_max_retries
        base_delay = 1.0

        for attempt in range(1, max_retries + 1):
            try:
                # We use asyncio.to_thread because the current genai client
                # might be synchronous or we want to ensure non-blocking execution.
                # If google-genai provides an async client, we can use it directly.
                # Currently standardizing on `client.models.generate_content`.
                response = await asyncio.to_thread(
                    self._client.models.generate_content,
                    model=self._settings.gemma_model,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=self._settings.gemma_temperature,
                        max_output_tokens=self._settings.gemma_max_output_tokens,
                    ),
                )

                if not response.text:
                    raise ValueError("Received empty response from Gemma.")

                # Parse and validate JSON
                return parse_llm_json(response.text, schema_model)

            except (JSONValidationError, ValueError) as exc:
                logger.warning("Attempt %d failed JSON validation: %s", attempt, exc)
                if attempt == max_retries:
                    logger.error("Max retries reached for Gemma generation.")
                    raise RuntimeError(f"Failed to generate valid output: {exc}") from exc
                
                await asyncio.sleep(base_delay * attempt)
                
            except Exception as exc:
                logger.error("Unexpected error during Gemma generation on attempt %d: %s", attempt, exc)
                if attempt == max_retries:
                    raise RuntimeError(f"Gemma API failure: {exc}") from exc
                
                await asyncio.sleep(base_delay * attempt)

    async def process_story(self, story_input: StoryProcessingInput) -> ProcessedStoryOutput:
        """Run unified story analysis and return structured JSON."""
        logger.info("Processing story for speaker: %s", story_input.speaker.name)
        
        # Format the comprehensive prompt
        prompt = self._prompt_loader.render(
            "process_story.txt",
            prompt_rules=self._prompt_rules,
            translation_rules=self._translation_rules,
            transcript=story_input.transcript,
            language=story_input.language,
            speaker_name=story_input.speaker.name,
            speaker_age=str(story_input.speaker.age) if story_input.speaker.age else "Unknown",
            occupation=story_input.speaker.occupation or "Unknown",
            village=story_input.location.village or "Unknown",
            district=story_input.location.district,
            state=story_input.location.state,
            country=story_input.location.country,
            extra_metadata=str(story_input.metadata),
        )

        return await self._generate_with_retry(prompt, ProcessedStoryOutput)

    async def chat_archive(self, chat_input: ArchiveChatInput) -> ArchiveChatOutput:
        """Answer a visitor question grounded in supplied archive context."""
        logger.info("Chat query received: %s", chat_input.question)
        
        prompt = self._prompt_loader.render(
            "chat_archive.txt",
            prompt_rules=self._prompt_rules,
            context=chat_input.context,
            question=chat_input.question,
            metadata=str(chat_input.metadata),
        )

        return await self._generate_with_retry(prompt, ArchiveChatOutput)


def get_gemma_service() -> GemmaService:
    """Dependency provider for GemmaService."""
    return GemmaService()
