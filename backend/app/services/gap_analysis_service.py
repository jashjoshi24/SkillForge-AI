"""
Module C — skill gap analysis engine.

Not a bare "skill exists = yes/no": every target-role skill carries an
importance weight, and gap_skills get a priority_score derived from that
weight so the roadmap generator (Module D) knows what to tackle first.
"""
from app.data.skill_maps import get_skill_map, normalize_skill_name
from app.schemas.common import ImportanceLevel, TargetRole
from app.schemas.gap_analysis import GapAnalysisResult, GapSkill, MatchedSkill
from app.schemas.resume import SkillItem

_IMPORTANCE_WEIGHT = {
    ImportanceLevel.CRITICAL: 100.0,
    ImportanceLevel.IMPORTANT: 65.0,
    ImportanceLevel.NICE_TO_HAVE: 30.0,
}


def analyze_gap(user_skills: list[SkillItem], target_role: TargetRole) -> GapAnalysisResult:
    skill_map = get_skill_map(target_role)

    normalized_user_skills: dict[str, SkillItem] = {}
    for skill in user_skills:
        normalized_user_skills[normalize_skill_name(skill.name)] = skill

    matched: list[MatchedSkill] = []
    gaps: list[GapSkill] = []

    for required_name, meta in skill_map.items():
        importance = ImportanceLevel(meta["importance"])
        user_skill = normalized_user_skills.get(required_name)
        if user_skill is not None:
            matched.append(
                MatchedSkill(
                    skill=required_name,
                    category=meta["category"],
                    importance=importance,
                    user_proficiency=user_skill.proficiency,
                )
            )
        else:
            gaps.append(
                GapSkill(
                    skill=required_name,
                    category=meta["category"],
                    importance=importance,
                    priority_score=_IMPORTANCE_WEIGHT[importance],
                )
            )

    unmapped = [
        skill.name
        for norm_name, skill in normalized_user_skills.items()
        if norm_name not in skill_map
    ]

    prioritized_gaps = sorted(gaps, key=lambda g: g.priority_score, reverse=True)
    total = len(skill_map)
    match_percentage = round((len(matched) / total) * 100, 1) if total else 0.0

    from app.schemas.common import TARGET_ROLE_LABELS

    return GapAnalysisResult(
        target_role=target_role,
        target_role_label=TARGET_ROLE_LABELS[target_role.value],
        matched_skills=matched,
        gap_skills=gaps,
        prioritized_gaps=prioritized_gaps,
        match_percentage=match_percentage,
        unmapped_user_skills=unmapped,
    )
