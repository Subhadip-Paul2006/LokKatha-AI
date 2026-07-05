"""Dynamic prompt template loading from the prompts directory."""

from __future__ import annotations

import logging
from functools import lru_cache
from pathlib import Path

from app.core.exceptions import ConfigurationError

logger = logging.getLogger(__name__)

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"


class PromptLoader:
    """Loads and caches plain-text prompt templates from ``app/prompts/``."""

    def __init__(self, prompts_dir: Path | None = None) -> None:
        self._prompts_dir = prompts_dir or PROMPTS_DIR

    def load(self, filename: str) -> str:
        """Read a prompt file and return its contents.

        Raises:
            ConfigurationError: If the prompt file does not exist.
        """
        path = self._prompts_dir / filename
        if not path.is_file():
            raise ConfigurationError(f"Prompt file not found: {path}")

        content = path.read_text(encoding="utf-8").strip()
        logger.debug("Loaded prompt template: %s (%d chars)", filename, len(content))
        return content

    def render(self, filename: str, **variables: str) -> str:
        """Load a template and substitute ``{placeholder}`` variables."""
        template = self.load(filename)
        try:
            return template.format(**variables)
        except KeyError as exc:
            missing = str(exc).strip("'")
            raise ConfigurationError(
                f"Missing placeholder '{missing}' in prompt template '{filename}'."
            ) from exc


@lru_cache
def get_prompt_loader() -> PromptLoader:
    """Return a cached PromptLoader instance."""
    return PromptLoader()
