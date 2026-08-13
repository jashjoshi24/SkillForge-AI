from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, RoadmapItem, ProgressLog, SkillGap
from backend.auth.dependencies import get_current_user
from backend.services.analytics_service import (
    calculate_user_progress_summary,
    get_skills_timeline_data,
    get_skill_terrain_map_state
)

router = APIRouter(prefix="/progress", tags=["Progress Tracking & Analytics"])

# --- Schemas ---
class ItemStatusUpdate(BaseModel):
    status: str  # not_started, in_progress, completed

# --- Routes ---

@router.get("/summary")
def get_progress_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns high-level user completion percentages, phase progress, and activity logs.
    """
    return calculate_user_progress_summary(current_user, db)

@router.put("/roadmap-items/{item_id}/status")
def update_roadmap_item_status(
    item_id: int,
    status_in: ItemStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    valid_statuses = {"not_started", "in_progress", "completed"}
    if status_in.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{status_in.status}'. Must be one of {valid_statuses}"
        )

    item = db.query(RoadmapItem).filter(
        RoadmapItem.id == item_id,
        RoadmapItem.user_id == current_user.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Roadmap item not found")

    old_status = item.status
    item.status = status_in.status
    db.commit()
    db.refresh(item)

    # Log progress change
    log_entry = ProgressLog(
        user_id=current_user.id,
        item_id=item.id,
        item_type="roadmap_item",
        action="status_change",
        previous_status=old_status,
        new_status=item.status
    )
    db.add(log_entry)

    # Automatically close skill gap if item has associated skill tag and is completed
    if item.status == "completed" and item.gap_skill_tag:
        gap = db.query(SkillGap).filter(
            SkillGap.user_id == current_user.id,
            SkillGap.skill_name.ilike(f"%{item.gap_skill_tag}%")
        ).first()
        if gap:
            gap.status = "closed"
            gap.user_proficiency = 0.9

    db.commit()

    return {
        "id": item.id,
        "title": item.title,
        "previous_status": old_status,
        "new_status": item.status,
        "gap_skill_tag": item.gap_skill_tag
    }

@router.get("/skills-timeline")
def get_skills_timeline(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns time-series data for rendering Chart.js progression charts.
    """
    return get_skills_timeline_data(current_user, db)

@router.get("/terrain-state")
def get_terrain_state(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns elevation, contour level, active peaks, and gap terrain nodes
    for the signature Skill Terrain Map visualizer.
    """
    return get_skill_terrain_map_state(current_user, db)
