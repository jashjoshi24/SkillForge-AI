"""initial schema — users, skill_profiles, roadmaps, roadmap_items, recommendations, progress

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-08-11

Hand-authored to exactly match app/models.py (the schema's single source
of truth per the project docs). Regenerate future changes with:

    alembic revision --autogenerate -m "description"

rather than hand-editing further migrations where possible.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=False), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("name", sa.String(255), nullable=True),
        sa.Column("target_role", sa.String(100), nullable=True),
        sa.Column("education_level", sa.String(100), nullable=True),
        sa.Column("hashed_password", sa.String(255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "skill_profiles",
        sa.Column("id", postgresql.UUID(as_uuid=False), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=False), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("skills", sa.JSON(), nullable=False),
        sa.Column("projects", sa.JSON(), nullable=False),
        sa.Column("experience", sa.JSON(), nullable=False),
        sa.Column("education", sa.JSON(), nullable=False),
        sa.Column("source_filename", sa.String(255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "roadmaps",
        sa.Column("id", postgresql.UUID(as_uuid=False), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=False), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("target_role", sa.String(100), nullable=False),
        sa.Column("current_level", sa.String(50), nullable=True),
        sa.Column("status", sa.Enum("active", "archived", name="roadmapstatus", native_enum=False), nullable=False),
        sa.Column("generated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("raw_json", sa.JSON(), nullable=False),
    )
    op.create_index("ix_roadmaps_user_id", "roadmaps", ["user_id"])

    op.create_table(
        "roadmap_items",
        sa.Column("id", postgresql.UUID(as_uuid=False), primary_key=True),
        sa.Column("roadmap_id", postgresql.UUID(as_uuid=False), sa.ForeignKey("roadmaps.id", ondelete="CASCADE"), nullable=False),
        sa.Column("phase", sa.String(50), nullable=False),
        sa.Column("order_index", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("skills", sa.JSON(), nullable=False),
        sa.Column("resources", sa.JSON(), nullable=False),
        sa.Column("resource_url", sa.String(1000), nullable=True),
        sa.Column("estimated_time", sa.String(100), nullable=True),
        sa.Column("status", sa.Enum("not_started", "in_progress", "done", name="itemstatus", native_enum=False), nullable=False),
    )
    op.create_index("ix_roadmap_items_roadmap_id", "roadmap_items", ["roadmap_id"])

    op.create_table(
        "recommendations",
        sa.Column("id", postgresql.UUID(as_uuid=False), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=False), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("type", sa.Enum("project", "certification", "interview_question", name="recommendationtype", native_enum=False), nullable=False),
        sa.Column("content", sa.JSON(), nullable=False),
        sa.Column("skill_tag", sa.String(100), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_recommendations_user_id", "recommendations", ["user_id"])

    op.create_table(
        "progress",
        sa.Column("id", postgresql.UUID(as_uuid=False), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=False), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("item_id", postgresql.UUID(as_uuid=False), sa.ForeignKey("roadmap_items.id", ondelete="CASCADE"), nullable=False),
        sa.Column("status", sa.Enum("not_started", "in_progress", "done", name="itemstatus_progress", native_enum=False), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("user_id", "item_id", name="uq_progress_user_item"),
    )
    op.create_index("ix_progress_user_id", "progress", ["user_id"])


def downgrade() -> None:
    op.drop_table("progress")
    op.drop_table("recommendations")
    op.drop_table("roadmap_items")
    op.drop_table("roadmaps")
    op.drop_table("skill_profiles")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
