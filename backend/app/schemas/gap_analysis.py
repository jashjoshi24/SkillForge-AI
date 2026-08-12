from pydantic import BaseModel, Field

from app.schemas.common import ImportanceLevel, ProficiencyLevel, TargetRole


class MatchedSkill(BaseModel):
    skill: str
    category: str
    importance: ImportanceLevel
    user_proficiency: ProficiencyLevel | None = None


class GapSkill(BaseModel):
    skill: str
    category: str
    importance: ImportanceLevel
    priority_score: float = Field(description="0-100, higher = more urgent to close this gap")


class GapAnalysisResult(BaseModel):
    target_role: TargetRole
    target_role_label: str
    matched_skills: list[MatchedSkill] = Field(default_factory=list)
    gap_skills: list[GapSkill] = Field(default_factory=list)
    prioritized_gaps: list[GapSkill] = Field(
        default_factory=list, description="gap_skills sorted by priority_score descending"
    )
    match_percentage: float = Field(ge=0, le=100)
    unmapped_user_skills: list[str] = Field(
        default_factory=list, description="User skills that didn't map to this role's skill map at all"
    )
