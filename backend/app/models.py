"""
Shared SQLAlchemy models — the single source of truth for the SkillForge AI
schema (per project docs, Section 11). All three team members import from
this file rather than defining competing models.

Ownership map (who is expected to primarily read/write which table):
  - User            : Module A (Auth) — Member 2. Member 1 only reads/creates
                      a minimal record via the dev-auth stub until real auth
                      lands (see app/dependencies.py).
  - SkillProfile    : Module B — Member 1 (this module).
  - Roadmap /
    RoadmapItem     : Module D — Member 1 (this module).
  - Recommendation  : Module E — Member 2. Included here only so the schema
                      exists and roadmap items can be referenced from it;
                      Member 1 does not implement its business logic.
  - Progress        : Module F — Member 2. Same note as above.

Do not drop or rename columns another module depends on without coordinating
in the team chat, per the docs' schema-change workflow.
"""
import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    JSON,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class ItemStatus(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class RoadmapStatus(str, enum.Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"


class RecommendationType(str, enum.Enum):
    PROJECT = "project"
    CERTIFICATION = "certification"
    INTERVIEW_QUESTION = "interview_question"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=_uuid)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    target_role: Mapped[str | None] = mapped_column(String(100), nullable=True)
    education_level: Mapped[str | None] = mapped_column(String(100), nullable=True)
    # Hashed password lives here so Member 2's real auth module has a home
    # for it without a schema migration; the dev-auth stub never sets it.
    hashed_password: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    skill_profile: Mapped["SkillProfile | None"] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    roadmaps: Mapped[list["Roadmap"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", order_by="Roadmap.generated_at.desc()"
    )
    recommendations: Mapped[list["Recommendation"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    progress_entries: Mapped[list["Progress"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class SkillProfile(Base):
    """Module B — the persisted, user-confirmed extraction result."""

    __tablename__ = "skill_profiles"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    # Structured JSON matching app.schemas.resume.ExtractedProfile:
    # skills: [{name, category, proficiency, evidence}]
    skills: Mapped[list] = mapped_column(JSON, default=list)
    projects: Mapped[list] = mapped_column(JSON, default=list)
    experience: Mapped[list] = mapped_column(JSON, default=list)
    education: Mapped[list] = mapped_column(JSON, default=list)
    source_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, onupdate=_utcnow)

    user: Mapped["User"] = relationship(back_populates="skill_profile")


class Roadmap(Base):
    """Module D — a generated, persisted multi-phase roadmap."""

    __tablename__ = "roadmaps"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    target_role: Mapped[str] = mapped_column(String(100), nullable=False)
    current_level: Mapped[str | None] = mapped_column(String(50), nullable=True)
    status: Mapped[RoadmapStatus] = mapped_column(
        Enum(RoadmapStatus, native_enum=False), default=RoadmapStatus.ACTIVE
    )
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)
    # Full raw LLM-generated + validated roadmap JSON, kept alongside the
    # normalized RoadmapItem rows so nothing is lost if the item schema
    # evolves later.
    raw_json: Mapped[dict] = mapped_column(JSON, default=dict)

    user: Mapped["User"] = relationship(back_populates="roadmaps")
    items: Mapped[list["RoadmapItem"]] = relationship(
        back_populates="roadmap", cascade="all, delete-orphan", order_by="RoadmapItem.order_index"
    )


class RoadmapItem(Base):
    __tablename__ = "roadmap_items"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=_uuid)
    roadmap_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("roadmaps.id", ondelete="CASCADE"), nullable=False, index=True
    )
    phase: Mapped[str] = mapped_column(String(50), nullable=False)  # Foundations / Core Skills / Projects / Interview Preparation
    order_index: Mapped[int] = mapped_column(Integer, default=0)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    skills: Mapped[list] = mapped_column(JSON, default=list)
    resources: Mapped[list] = mapped_column(JSON, default=list)  # [{title, url, type}]
    resource_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)  # convenience single link
    estimated_time: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[ItemStatus] = mapped_column(Enum(ItemStatus, native_enum=False), default=ItemStatus.NOT_STARTED)

    roadmap: Mapped["Roadmap"] = relationship(back_populates="items")
    progress_entries: Mapped[list["Progress"]] = relationship(back_populates="roadmap_item")


class Recommendation(Base):
    """Module E (owned by Member 2) — included for schema completeness only."""

    __tablename__ = "recommendations"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    type: Mapped[RecommendationType] = mapped_column(Enum(RecommendationType, native_enum=False), nullable=False)
    content: Mapped[dict] = mapped_column(JSON, default=dict)
    skill_tag: Mapped[str | None] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    user: Mapped["User"] = relationship(back_populates="recommendations")


class Progress(Base):
    """Module F (owned by Member 2) — included for schema completeness only."""

    __tablename__ = "progress"
    __table_args__ = (UniqueConstraint("user_id", "item_id", name="uq_progress_user_item"),)

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    item_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("roadmap_items.id", ondelete="CASCADE"), nullable=False
    )
    status: Mapped[ItemStatus] = mapped_column(Enum(ItemStatus, native_enum=False), default=ItemStatus.NOT_STARTED)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, onupdate=_utcnow)

    user: Mapped["User"] = relationship(back_populates="progress_entries")
    roadmap_item: Mapped["RoadmapItem"] = relationship(back_populates="progress_entries")
