"""
Module D — AI roadmap generator.

Input: skill profile + skill gaps (from Module C) + target role + current
level. Output: a validated, 4-phase RoadmapResponse. Never trusts raw LLM
output blindly — malformed phases/items are dropped individually (with a
warning) rather than failing the whole generation, and a lightweight
"vagueness" heuristic flags suspiciously generic item titles for logging.
"""
import logging
from datetime import datetime, timezone

from pydantic import ValidationError

from app.core.exceptions import LLMError
from app.prompts.roadmap_prompt import ROADMAP_SYSTEM_PROMPT, build_roadmap_user_prompt
from app.schemas.common import TARGET_ROLE_LABELS, TargetRole
from app.schemas.gap_analysis import GapAnalysisResult
from app.schemas.resume import ExtractedProfile
from app.schemas.roadmap import RoadmapItemSchema, RoadmapPhase, RoadmapPhaseName, RoadmapResponse
from app.services.llm_client import LLMProvider, extract_json_object

logger = logging.getLogger("skillforge.roadmap")

_VAGUE_TITLES = {"learn programming", "get better at coding", "practice coding", "learn backend", "learn frontend"}

REQUIRED_PHASES = [
    RoadmapPhaseName.FOUNDATIONS,
    RoadmapPhaseName.CORE_SKILLS,
    RoadmapPhaseName.PROJECTS,
    RoadmapPhaseName.INTERVIEW_PREP,
]


def _profile_summary(profile: ExtractedProfile) -> dict:
    return {
        "skill_count": len(profile.skills),
        "top_skills": [s.name for s in profile.skills[:15]],
        "project_count": len(profile.projects),
        "experience_count": len(profile.experience),
        "education": [e.degree for e in profile.education],
    }


def generate_roadmap(
    profile: ExtractedProfile,
    gap_result: GapAnalysisResult,
    target_role: TargetRole,
    current_level: str,
    llm: LLMProvider,
) -> RoadmapResponse:
    matched = [m.model_dump(mode="json") for m in gap_result.matched_skills]
    gaps = [g.model_dump(mode="json") for g in gap_result.prioritized_gaps]

    raw_response = llm.generate_json(
        system_prompt=ROADMAP_SYSTEM_PROMPT,
        user_prompt=build_roadmap_user_prompt(
            target_role_label=gap_result.target_role_label,
            current_level=current_level,
            matched_skills=matched,
            gap_skills=gaps,
            profile_summary=_profile_summary(profile),
        ),
        max_tokens=8192,
    )

    try:
        data = extract_json_object(raw_response)
    except Exception as exc:  # noqa: BLE001
        raise LLMError("The AI roadmap response wasn't valid JSON.") from exc

    phases = _validate_phases(data)
    _ensure_all_phases_present(phases, target_role, current_level, gap_result)

    return RoadmapResponse(
        target_role=target_role,
        target_role_label=TARGET_ROLE_LABELS[target_role.value],
        current_level=current_level,
        generated_at=datetime.now(timezone.utc),
        phases=phases,
    )


def _validate_phases(data: dict) -> list[RoadmapPhase]:
    raw_phases = data.get("phases")
    if not isinstance(raw_phases, list):
        raise LLMError("The AI roadmap response was missing a 'phases' array.")

    phases: list[RoadmapPhase] = []
    for raw_phase in raw_phases:
        try:
            phase = RoadmapPhase.model_validate(raw_phase)
        except ValidationError:
            phase = _validate_phase_with_item_dropping(raw_phase)
            if phase is None:
                continue
        if phase.items:
            for item in phase.items:
                if item.title.strip().lower() in _VAGUE_TITLES:
                    logger.warning("Roadmap item title looked generic/vague: %r", item.title)
            phases.append(phase)
    return phases


def _validate_phase_with_item_dropping(raw_phase: dict) -> RoadmapPhase | None:
    if not isinstance(raw_phase, dict) or "phase" not in raw_phase:
        return None
    try:
        phase_name = RoadmapPhaseName(raw_phase["phase"])
    except ValueError:
        return None

    items: list[RoadmapItemSchema] = []
    for raw_item in raw_phase.get("items", []):
        try:
            items.append(RoadmapItemSchema.model_validate(raw_item))
        except ValidationError:
            logger.warning("Dropped a malformed roadmap item in phase %s", phase_name)
    return RoadmapPhase(phase=phase_name, items=items)


def _ensure_all_phases_present(
    phases: list[RoadmapPhase],
    target_role: TargetRole,
    current_level: str,
    gap_result: GapAnalysisResult,
) -> None:
    """
    Guarantee every documented phase exists, even if the LLM skipped one, so
    the frontend always has 4 waypoints to render. A missing phase gets one
    grounded fallback item built from the user's actual top gap skills
    instead of a vague placeholder.
    """
    present = {p.phase for p in phases}
    for required in REQUIRED_PHASES:
        if required in present:
            continue
        fallback_skills = [g.skill for g in gap_result.prioritized_gaps[:3]] or ["core fundamentals"]
        phases.append(
            RoadmapPhase(
                phase=required,
                items=[
                    RoadmapItemSchema(
                        title=f"{required.value}: {', '.join(fallback_skills)}",
                        description=(
                            f"The AI didn't return this phase directly, so this fallback item was generated "
                            f"from your highest-priority gap skills for {TARGET_ROLE_LABELS[target_role.value]}: "
                            f"{', '.join(fallback_skills)}."
                        ),
                        skills=fallback_skills,
                        resources=[],
                        estimated_time="1-2 weeks",
                    )
                ],
            )
        )
    # Keep phases in the canonical documented order regardless of LLM ordering.
    order = {p: i for i, p in enumerate(REQUIRED_PHASES)}
    phases.sort(key=lambda p: order.get(p.phase, 99))
