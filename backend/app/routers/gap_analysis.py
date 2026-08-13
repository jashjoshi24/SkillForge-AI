"""
Module C route — compares the user's persisted skill profile against a
target-role skill map.

    GET /gap-analysis?target_role=backend_developer
"""
import logging

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.dependencies import get_current_user
from app.database import get_db
from app.models import SkillProfile, User
from app.schemas.common import TargetRole
from app.schemas.gap_analysis import GapAnalysisResult
from app.schemas.resume import SkillItem
from app.services.gap_analysis_service import analyze_gap

logger = logging.getLogger("skillforge.routers.gap_analysis")

router = APIRouter(prefix="/gap-analysis", tags=["Module C — Skill Gap Analysis"])


@router.get("", response_model=GapAnalysisResult, summary="Compare the user's skills against a target role")
def get_gap_analysis(
    target_role: TargetRole = Query(..., description="One of the supported target roles"),
    persist_target_role: bool = Query(
        default=True, description="If true, also saves this as the user's target_role on their profile."
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = db.query(SkillProfile).filter(SkillProfile.user_id == current_user.id).one_or_none()
    if profile is None:
        raise NotFoundError(
            "No skill profile found yet. Upload and confirm a resume first (see /extract) before "
            "running a gap analysis."
        )

    user_skills = [SkillItem.model_validate(s) for s in profile.skills]
    result = analyze_gap(user_skills, target_role)

    if persist_target_role:
        current_user.target_role = target_role.value
        db.commit()

    logger.info(
        "Gap analysis user=%s role=%s match=%.1f%% gaps=%d",
        current_user.id, target_role.value, result.match_percentage, len(result.gap_skills),
    )
    return result
