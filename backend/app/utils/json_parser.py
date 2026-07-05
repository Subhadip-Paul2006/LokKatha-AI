"""Robust JSON extraction and Pydantic validation for LLM responses."""

from __future__ import annotations

import json
import logging
import re
from typing import TypeVar

from pydantic import BaseModel, ValidationError

from app.core.exceptions import JSONValidationError

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)

_JSON_FENCE_PATTERN = re.compile(r"```(?:json)?\s*", re.IGNORECASE)


def strip_json_fences(text: str) -> str:
    """Remove markdown code fences from an LLM response."""
    cleaned = _JSON_FENCE_PATTERN.sub("", text)
    return cleaned.replace("```", "").strip()


def extract_json_object(text: str) -> dict:
    """Extract the first JSON object from free-form LLM text.

    Raises:
        JSONValidationError: If no valid JSON object can be found.
    """
    cleaned = strip_json_fences(text)
    start = cleaned.find("{")
    end = cleaned.rfind("}")

    if start == -1 or end == -1 or end <= start:
        raise JSONValidationError(
            "No JSON object found in model response.",
            detail=cleaned[:500],
        )

    candidate = cleaned[start : end + 1]

    try:
        parsed = json.loads(candidate)
    except json.JSONDecodeError as exc:
        raise JSONValidationError(
            f"Malformed JSON in model response: {exc.msg}",
            detail=candidate[:500],
        ) from exc

    if not isinstance(parsed, dict):
        raise JSONValidationError(
            "Expected a JSON object but received a different type.",
            detail=str(type(parsed)),
        )

    return parsed


def validate_json_model(data: dict, model: type[T]) -> T:
    """Validate a parsed dict against a Pydantic model.

    Raises:
        JSONValidationError: If validation fails.
    """
    try:
        return model.model_validate(data)
    except ValidationError as exc:
        raise JSONValidationError(
            "JSON structure does not match the expected schema.",
            detail=exc.json(),
        ) from exc


def parse_llm_json(text: str, model: type[T]) -> T:
    """Extract and validate a JSON object from LLM output in one step.

    Raises:
        JSONValidationError: On extraction or validation failure.
    """
    data = extract_json_object(text)
    return validate_json_model(data, model)
