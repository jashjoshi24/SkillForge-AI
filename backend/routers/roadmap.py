from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, Roadmap, RoadmapItem
from backend.auth.dependencies import get_current_user
from backend.services.roadmap_service import generate_roadmap_for_user

router = APIRouter(prefix="/roadmap", tags=["AI Roadmap Generator"])

# --- Schemas ---
class RoadmapItemSchema(BaseModel):
    id: int
    phase: str
    phase_number: int
    title: str
    description: Optional[str]
    resource_url: Optional[str]
    gap_skill_tag: Optional[str]
    status: str

    class Config:
        from_attributes = True

class RoadmapResponse(BaseModel):
    id: int
    user_id: int
    target_role: str
    title: str
    items: List[RoadmapItemSchema]

    class Config:
        from_attributes = True

# --- Routes ---

@router.post("/generate", response_model=RoadmapResponse)
def generate_roadmap(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Module D: Generates multi-stage sequential career roadmap for user
    based on skill gaps and target role.
    """
    roadmap = generate_roadmap_for_user(current_user, db)
    return roadmap

@router.get("", response_model=RoadmapResponse)
def get_roadmap(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    roadmap = db.query(Roadmap).filter(Roadmap.user_id == current_user.id).order_by(Roadmap.id.desc()).first()
    if not roadmap:
        roadmap = generate_roadmap_for_user(current_user, db)
    return roadmap
