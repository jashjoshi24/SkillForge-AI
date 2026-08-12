"""
Pydantic schemas for Module B (resume upload & skill extraction).

`ExtractedProfile` is the structured-extraction contract:
    {"skills": [...], "projects": [...], "experience": [...], "education": [...]}
as specified in the project docs. Every field has a safe default so a
partial or slightly malformed LLM response can still be coerced into a
valid profile instead of hard-failing the whole request.
"""
from datetime import datetime

from pydantic import BaseModel, Field, field_validator

from app.schemas.common import ProficiencyLevel


class SkillItem(BaseModel):
    name: str
    category: str | None = Field(default=None, description='e.g. "language", "framework", "tool", "soft_skill"')
    proficiency: ProficiencyLevel | None = None
    evidence: str | None = Field(
        default=None, description="Short quote/paraphrase from the resume that supports this skill, if any."
    )

    @field_validator("name")
    @classmethod
    def name_must_not_be_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("skill name must not be blank")
        return v


class ProjectItem(BaseModel):
    name: str
    description: str | None = None
    technologies: list[str] = Field(default_factory=list)
    role: str | None = None
    url: str | None = None


class ExperienceItem(BaseModel):
    title: str
    company: str | None = None
    duration: str | None = None
    description: str | None = None
    technologies: list[str] = Field(default_factory=list)


class EducationItem(BaseModel):
    degree: str
    institution: str | None = None
    field: str | None = None
    duration: str | None = None


class ExtractedProfile(BaseModel):
    """The documented Module B contract, with structured (not just string) items."""

    skills: list[SkillItem] = Field(default_factory=list)
    projects: list[ProjectItem] = Field(default_factory=list)
    experience: list[ExperienceItem] = Field(default_factory=list)
    education: list[EducationItem] = Field(default_factory=list)
    extraction_notes: list[str] = Field(
        default_factory=list,
        description="Uncertainty flags the LLM raised, e.g. 'Dates for Project X were ambiguous'.",
    )


class ExtractionResponse(BaseModel):
    """Response of POST /extract/upload — not yet persisted, awaiting user review."""

    profile: ExtractedProfile
    source_filename: str
    warnings: list[str] = Field(default_factory=list)


class ConfirmProfileRequest(BaseModel):
    """Body of POST /extract/confirm — the user-reviewed/edited profile."""

    profile: ExtractedProfile
    source_filename: str | None = None


class SkillProfileResponse(BaseModel):
    id: str
    user_id: str
    skills: list[SkillItem]
    projects: list[ProjectItem]
    experience: list[ExperienceItem]
    education: list[EducationItem]
    source_filename: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
