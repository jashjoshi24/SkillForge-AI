from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field

from app.schemas.common import ItemStatus, TargetRole


class RoadmapPhaseName(str, Enum):
    FOUNDATIONS = "Foundations"
    CORE_SKILLS = "Core Skills"
    PROJECTS = "Projects"
    INTERVIEW_PREP = "Interview Preparation"


class Resource(BaseModel):
    title: str
    url: str | None = None
    type: str = Field(default="article", description='"article" | "course" | "video" | "docs" | "practice"')


class RoadmapItemSchema(BaseModel):
    title: str
    description: str
    skills: list[str] = Field(default_factory=list)
    resources: list[Resource] = Field(default_factory=list)
    estimated_time: str = "1 week"
    status: ItemStatus = ItemStatus.NOT_STARTED


class RoadmapPhase(BaseModel):
    phase: RoadmapPhaseName
    items: list[RoadmapItemSchema] = Field(default_factory=list)


class RoadmapGenerateRequest(BaseModel):
    target_role: TargetRole
    current_level: str = Field(default="beginner", description="beginner | intermediate | advanced")


class RoadmapResponse(BaseModel):
    id: str | None = None
    target_role: TargetRole
    target_role_label: str
    current_level: str
    generated_at: datetime
    phases: list[RoadmapPhase] = Field(default_factory=list)
