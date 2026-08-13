"""
Module D routes — generates and persists the AI roadmap.

    POST /roadmap/generate   {target_role, current_level} -> RoadmapResponse (persisted)
    GET  /roadmap            the user's current active roadmap
    GET  /roadmap/{roadmap_id}
"""
import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.dependencies import get_current_user
from app.database import get_db
from app.models import Roadmap, RoadmapItem, RoadmapStatus, SkillProfile, User
from app.schemas.gap_analysis import GapAnalysisResult
from app.schemas.resume import ExtractedProfile, SkillItem
from app.schemas.roadmap import RoadmapGenerateRequest, RoadmapResponse
from app.services.gap_analysis_service import analyze_gap
from app.services.llm_client import get_llm_provider
from app.services.roadmap_service import generate_roadmap

logger = logging.getLogger("skillforge.routers.roadmap")

router = APIRouter(prefix="/roadmap", tags=["Module D — AI Roadmap Generator"])


def _load_profile(db: Session, user: User) -> ExtractedProfile:
    profile = db.query(SkillProfile).filter(SkillProfile.user_id == user.id).one_or_none()
    if profile is None:
        raise NotFoundError(
            "No skill profile found yet. Upload and confirm a resume first (see /extract) before "
            "generating a roadmap."
        )
    return ExtractedProfile(
        skills=[SkillItem.model_validate(s) for s in profile.skills],
        projects=profile.projects,
        experience=profile.experience,
        education=profile.education,
    )


@router.post("/generate", response_model=RoadmapResponse, summary="Generate and persist a personalized roadmap")
def generate(
    body: RoadmapGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = _load_profile(db, current_user)
    gap_result: GapAnalysisResult = analyze_gap(profile.skills, body.target_role)

    llm = get_llm_provider()
    roadmap_response = generate_roadmap(
        profile=profile,
        gap_result=gap_result,
        target_role=body.target_role,
        current_level=body.current_level,
        llm=llm,
    )

    # Archive any previously active roadmap so /roadmap always returns the
    # single current one, while history is preserved (docs: "persists per
    # user, not regenerated from scratch every visit").
    db.query(Roadmap).filter(
        Roadmap.user_id == current_user.id, Roadmap.status == RoadmapStatus.ACTIVE
    ).update({"status": RoadmapStatus.ARCHIVED})

    roadmap_row = Roadmap(
        user_id=current_user.id,
        target_role=body.target_role.value,
        current_level=body.current_level,
        status=RoadmapStatus.ACTIVE,
        raw_json=roadmap_response.model_dump(mode="json"),
    )
    db.add(roadmap_row)
    db.flush()  # assign roadmap_row.id before creating items

    order_index = 0
    for phase in roadmap_response.phases:
        for item in phase.items:
            db.add(
                RoadmapItem(
                    roadmap_id=roadmap_row.id,
                    phase=phase.phase.value,
                    order_index=order_index,
                    title=item.title,
                    description=item.description,
                    skills=item.skills,
                    resources=[r.model_dump(mode="json") for r in item.resources],
                    resource_url=item.resources[0].url if item.resources else None,
                    estimated_time=item.estimated_time,
                )
            )
            order_index += 1

    db.commit()
    roadmap_response.id = roadmap_row.id
    logger.info(
        "Generated roadmap user=%s role=%s items=%d",
        current_user.id, body.target_role.value, order_index,
    )
    return roadmap_response


@router.get("", response_model=RoadmapResponse, summary="Get the user's current active roadmap")
def get_active_roadmap(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    roadmap_row = (
        db.query(Roadmap)
        .filter(Roadmap.user_id == current_user.id, Roadmap.status == RoadmapStatus.ACTIVE)
        .order_by(Roadmap.generated_at.desc())
        .first()
    )
    if roadmap_row is None:
        raise NotFoundError("No roadmap has been generated yet. POST /roadmap/generate first.")
    return _row_to_response(roadmap_row)


@router.get("/{roadmap_id}", response_model=RoadmapResponse, summary="Get a specific roadmap by id")
def get_roadmap(
    roadmap_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    roadmap_row = (
        db.query(Roadmap)
        .filter(Roadmap.id == roadmap_id, Roadmap.user_id == current_user.id)
        .one_or_none()
    )
    if roadmap_row is None:
        raise NotFoundError(f"Roadmap '{roadmap_id}' was not found for this user.")
    return _row_to_response(roadmap_row)


def _row_to_response(roadmap_row: Roadmap) -> RoadmapResponse:
    # raw_json is the validated, complete response captured at generation
    # time — reuse it directly rather than re-deriving from the normalized
    # RoadmapItem rows, so formatting/ordering stays exactly as generated.
    data = dict(roadmap_row.raw_json)
    data["id"] = roadmap_row.id
    return RoadmapResponse.model_validate(data)
