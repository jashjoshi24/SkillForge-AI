from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, Recommendation, ProgressLog
from backend.auth.dependencies import get_current_user
from backend.services.recommendations_service import generate_recommendations_for_user
from backend.data.certifications import get_certifications_by_domain

router = APIRouter(prefix="/recommendations", tags=["Recommendations Engine"])

# --- Schemas ---
class RecommendationResponse(BaseModel):
    id: int
    user_id: int
    type: str
    title: str
    description: str
    difficulty: str
    skill_tag: str
    status: str
    extra_data: dict

    class Config:
        from_attributes = True

class StatusUpdateIn(BaseModel):
    status: str  # saved, in_progress, completed, ignored


# --- Routes ---

@router.post("/generate", response_model=List[RecommendationResponse])
def generate_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generates new personalized project ideas, interview questions, and certifications
    for the current user based on their skill gaps.
    """
    recs = generate_recommendations_for_user(current_user, db)
    return recs

@router.get("", response_model=List[RecommendationResponse])
def list_recommendations(
    rec_type: Optional[str] = Query(None, alias="type"),
    difficulty: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Recommendation).filter(Recommendation.user_id == current_user.id)
    if rec_type:
        query = query.filter(Recommendation.type == rec_type)
    if difficulty:
        query = query.filter(Recommendation.difficulty == difficulty)
    if status_filter:
        query = query.filter(Recommendation.status == status_filter)
    
    results = query.order_by(Recommendation.id.desc()).all()
    
    # Auto-generate if empty
    if not results and not rec_type and not difficulty and not status_filter:
        results = generate_recommendations_for_user(current_user, db)
        
    return results

@router.put("/{rec_id}/status", response_model=RecommendationResponse)
def update_recommendation_status(
    rec_id: int,
    status_in: StatusUpdateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    valid_statuses = {"saved", "in_progress", "completed", "ignored"}
    if status_in.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{status_in.status}'. Must be one of {valid_statuses}"
        )

    rec = db.query(Recommendation).filter(
        Recommendation.id == rec_id,
        Recommendation.user_id == current_user.id
    ).first()

    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    old_status = rec.status
    rec.status = status_in.status
    db.commit()
    db.refresh(rec)

    # Log progress entry
    log_entry = ProgressLog(
        user_id=current_user.id,
        item_id=rec.id,
        item_type="recommendation",
        action="status_change",
        previous_status=old_status,
        new_status=rec.status
    )
    db.add(log_entry)
    db.commit()

    return rec

@router.get("/certifications")
def get_certifications(
    domain: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    target = domain or current_user.target_role
    return get_certifications_by_domain(target)
