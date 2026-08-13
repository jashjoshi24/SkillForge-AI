"""
Module B — orchestrates: validated file -> extracted text -> LLM structured
extraction -> validated ExtractedProfile.

Never trusts raw LLM output blindly: JSON parsing failures are repaired
once via a follow-up "fix your JSON" call, and Pydantic validation failures
fall back to a best-effort coercion (drop the offending item, keep the
rest, and record a note) rather than failing the whole request over one
bad sub-object.
"""
import logging

from pydantic import ValidationError

from app.core.exceptions import ExtractionError
from app.prompts.extraction_prompt import (
    EXTRACTION_SYSTEM_PROMPT,
    REPAIR_JSON_SYSTEM_PROMPT,
    build_extraction_user_prompt,
)
from app.schemas.resume import ExtractedProfile
from app.services.llm_client import LLMProvider, extract_json_object
from app.services.resume_parser import extract_text, validate_upload

logger = logging.getLogger("skillforge.extraction")

EMPTY_PROFILE_SHAPE = {"skills": [], "projects": [], "experience": [], "education": [], "extraction_notes": []}


def parse_and_extract(
    filename: str,
    content_type: str | None,
    content: bytes,
    llm: LLMProvider,
) -> tuple[ExtractedProfile, list[str]]:
    """Full pipeline for POST /extract/upload. Returns (profile, warnings)."""
    validate_upload(filename, content_type, content)
    resume_text = extract_text(filename, content)

    raw_response = llm.generate_json(
        system_prompt=EXTRACTION_SYSTEM_PROMPT,
        user_prompt=build_extraction_user_prompt(resume_text),
    )

    try:
        data = extract_json_object(raw_response)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Extraction JSON parse failed, attempting repair: %s", exc)
        repaired = llm.generate_json(system_prompt=REPAIR_JSON_SYSTEM_PROMPT, user_prompt=raw_response)
        try:
            data = extract_json_object(repaired)
        except Exception as repair_exc:  # noqa: BLE001
            raise ExtractionError(
                "The AI's response couldn't be parsed as structured resume data after a repair attempt. "
                "Please try uploading again."
            ) from repair_exc

    profile, warnings = _validate_with_fallback(data)
    return profile, warnings


def _validate_with_fallback(data: dict) -> tuple[ExtractedProfile, list[str]]:
    """
    Validate the LLM's JSON against ExtractedProfile. If the whole object is
    malformed, apply sensible defaults for missing top-level fields and
    retry once before giving up on a field entirely.
    """
    warnings: list[str] = []

    if not isinstance(data, dict):
        raise ExtractionError("The AI returned data that wasn't a JSON object.")

    normalized = {**EMPTY_PROFILE_SHAPE, **data}
    for key in ("skills", "projects", "experience", "education", "extraction_notes"):
        if not isinstance(normalized.get(key), list):
            warnings.append(f"Field '{key}' was missing or malformed in the AI response; defaulted to empty.")
            normalized[key] = []

    try:
        return ExtractedProfile.model_validate(normalized), warnings
    except ValidationError as exc:
        logger.warning("Full-profile validation failed, dropping bad items: %s", exc)
        return _drop_invalid_items(normalized, warnings)


def _drop_invalid_items(normalized: dict, warnings: list[str]) -> tuple[ExtractedProfile, list[str]]:
    from app.schemas.resume import EducationItem, ExperienceItem, ProjectItem, SkillItem

    field_models = {
        "skills": SkillItem,
        "projects": ProjectItem,
        "experience": ExperienceItem,
        "education": EducationItem,
    }
    cleaned: dict = {"extraction_notes": normalized.get("extraction_notes", [])}
    for field, model in field_models.items():
        valid_items = []
        for item in normalized.get(field, []):
            try:
                valid_items.append(model.model_validate(item))
            except ValidationError:
                warnings.append(f"Dropped one malformed entry from '{field}' that didn't match the expected shape.")
        cleaned[field] = valid_items

    return ExtractedProfile.model_validate(cleaned), warnings
