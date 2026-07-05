"""Validation script for Phase 03 AI Engine imports."""
import sys

checks = [
    (
        "Core config — AI fields",
        "from app.core.config import get_settings; s = get_settings(); "
        "assert s.gemma_model, 'gemma_model empty'; "
        "assert s.whisper_model, 'whisper_model empty'; "
        "print(f'  gemma_model={s.gemma_model}  whisper_model={s.whisper_model}')",
    ),
    (
        "Core exceptions — AI hierarchy",
        "from app.core.exceptions import "
        "AIServiceError, GemmaServiceError, WhisperServiceError, "
        "JSONValidationError, AIPipelineError; "
        "print('  AIServiceError, GemmaServiceError, WhisperServiceError, JSONValidationError, AIPipelineError OK')",
    ),
    (
        "Schemas — ai.py",
        "from app.schemas.ai import ("
        "StoryProcessingInput, ProcessedStoryOutput, StoryTranslations, "
        "TranscriptionResult, PipelineResult, ArchiveChatInput, "
        "ArchiveChatOutput, AudioProcessingInput, SpeakerInfo, LocationInfo); "
        "print('  all AI schema classes importable')",
    ),
    (
        "Utils — json_parser",
        "from app.utils.json_parser import parse_llm_json, extract_json_object, validate_json_model; "
        "print('  json_parser functions importable')",
    ),
    (
        "Utils — prompt_loader",
        "from app.utils.prompt_loader import PromptLoader, get_prompt_loader; "
        "print('  PromptLoader importable')",
    ),
    (
        "Prompts — all four templates loadable",
        """
from app.utils.prompt_loader import get_prompt_loader
pl = get_prompt_loader()
for fn in ["prompt_rules.txt", "translation_rules.txt", "process_story.txt", "chat_archive.txt"]:
    content = pl.load(fn)
    assert len(content) > 50, f"{fn} appears empty"
    print(f"  {fn}: {len(content)} chars OK")
""",
    ),
    (
        "Services — protocols",
        "from app.services.protocols import "
        "TranscriptionProvider, StoryProcessor, ArchiveChatProvider, AudioPipelineProvider; "
        "print('  all Protocol classes importable')",
    ),
    (
        "Services — GemmaService",
        "from app.services.gemma_service import GemmaService, get_gemma_service; "
        "print('  GemmaService importable')",
    ),
    (
        "Services — WhisperService",
        "from app.services.whisper_service import WhisperService, get_whisper_service; "
        "print('  WhisperService importable')",
    ),
    (
        "Services — PipelineService",
        "from app.services.pipeline import PipelineService, get_pipeline_service; "
        "print('  PipelineService importable')",
    ),
    (
        "Services — package __init__",
        "from app.services import GemmaService, WhisperService, PipelineService, "
        "StoryProcessor, TranscriptionProvider, ArchiveChatProvider, AudioPipelineProvider; "
        "print('  services package re-exports OK')",
    ),
    (
        "Core — lifespan",
        "from app.core.lifespan import lifespan; "
        "import inspect; "
        "assert inspect.isasyncgenfunction(lifespan), 'lifespan must be async generator'; "
        "print('  lifespan async context manager OK')",
    ),
    (
        "JSON parser — round-trip smoke test",
        """
from app.utils.json_parser import parse_llm_json
from app.schemas.ai import ProcessedStoryOutput, StoryTranslations

raw = '''
```json
{
  "title": "The Weaver of Stars",
  "summary": "An elder recalls the ancient craft of the village.",
  "translations": {
    "english": "The weaver sat beneath the banyan tree.",
    "bengali": "তাঁতি বটগাছের নিচে বসেছিলেন।",
    "hindi": "बुनकर बरगद के पेड़ के नीचे बैठे थे।"
  },
  "keywords": ["weaving", "craft", "heritage", "village", "elder"],
  "cultural_tags": ["Traditional Craft", "Oral History", "Folk Memory"],
  "historical_importance": "Preserves knowledge of a near-extinct weaving tradition.",
  "suggested_questions": ["What materials were used?", "Is this craft still practiced?"],
  "story": "Long ago, beneath the banyan tree, an elder wove stories into cloth."
}
```
'''

result = parse_llm_json(raw, ProcessedStoryOutput)
assert result.title == "The Weaver of Stars"
assert result.translations.bengali
print(f"  JSON parse + Pydantic validation OK — title: '{result.title}'")
""",
    ),
]

all_ok = True
for name, code in checks:
    try:
        exec(compile(code.strip(), "<check>", "exec"))
        print(f"[PASS] {name}")
    except Exception as exc:
        print(f"[FAIL] {name}")
        print(f"       {type(exc).__name__}: {exc}")
        all_ok = False

print()
if all_ok:
    print("=" * 60)
    print("  Phase 03 AI Engine — ALL CHECKS PASSED")
    print("=" * 60)
else:
    print("=" * 60)
    print("  Phase 03 AI Engine — SOME CHECKS FAILED")
    print("=" * 60)

sys.exit(0 if all_ok else 1)
