"""
Module B routes — resume upload, AI extraction, editable review, and
persistence of the confirmed skill profile.

    POST /extract/upload   multipart file -> ExtractionResponse (not saved yet)
    POST /extract/confirm  user-reviewed profile -> persisted SkillProfileResponse
    GET  /extract/profile  the current user's persisted skill profile
"""
import logging

from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.dependencies import get_current_user
from app.database import get_db
from app.models import SkillProfile, User
from app.schemas.resume import (
    ConfirmProfileRequest,
    ExtractionResponse,
    SkillProfileResponse,
)
from app.services.extraction_service import parse_and_extract
from app.services.llm_client import get_llm_provider

logger = logging.getLogger("skillforge.routers.resume")

router = APIRouter(prefix="/extract", tags=["Module B — Resume Extraction"])


@router.post("/upload", response_model=ExtractionResponse, summary="Upload a resume and get AI-extracted data")
async def upload_resume(
    file: UploadFile,
    current_user: User = Depends(get_current_user),
):
    content = await file.read()
    llm = get_llm_provider()
    profile, warnings = parse_and_extract(
        filename=file.filename or "resume",
        content_type=file.content_type,
        content=content,
        llm=llm,
    )
    logger.info("Extracted resume for user=%s file=%s skills=%d", current_user.id, file.filename, len(profile.skills))
    return ExtractionResponse(profile=profile, source_filename=file.filename or "resume", warnings=warnings)


@router.post(
    "/confirm",
    response_model=SkillProfileResponse,
    summary="Persist the user-reviewed/edited extraction as their skill profile",
)
def confirm_profile(
    body: ConfirmProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(SkillProfile).filter(SkillProfile.user_id == current_user.id).one_or_none()
    payload = body.profile.model_dump(mode="json")

    if existing is None:
        existing = SkillProfile(
            user_id=current_user.id,
            skills=payload["skills"],
            projects=payload["projects"],
            experience=payload["experience"],
            education=payload["education"],
            source_filename=body.source_filename,
        )
        db.add(existing)
    else:
        existing.skills = payload["skills"]
        existing.projects = payload["projects"]
        existing.experience = payload["experience"]
        existing.education = payload["education"]
        existing.source_filename = body.source_filename or existing.source_filename

    db.commit()
    db.refresh(existing)
    logger.info("Persisted skill profile for user=%s", current_user.id)
    return SkillProfileResponse.model_validate(existing)


@router.get("/profile", response_model=SkillProfileResponse, summary="Get the current user's persisted skill profile")
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = db.query(SkillProfile).filter(SkillProfile.user_id == current_user.id).one_or_none()
    if profile is None:
        raise NotFoundError(
            "No skill profile found yet. Upload and confirm a resume first via POST /extract/upload "
            "and POST /extract/confirm."
        )
    return SkillProfileResponse.model_validate(profile)
