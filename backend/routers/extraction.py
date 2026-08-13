from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, SkillProfile, SkillGap
from backend.auth.dependencies import get_current_user
from backend.services.extraction_service import extract_skills_from_text, analyze_skill_gaps

router = APIRouter(prefix="", tags=["Resume Extraction & Skill Gap Analysis"])

# --- Schemas ---
class ManualSkillsIn(BaseModel):
    skills: List[str]
    projects: Optional[List[dict]] = []
    experience: Optional[List[dict]] = []
    education: Optional[List[dict]] = []

class SkillGapResponse(BaseModel):
    id: int
    skill_name: str
    category: str
    user_proficiency: float
    required_proficiency: float
    priority_score: str
    status: str

    class Config:
        from_attributes = True

# --- Routes ---

@router.post("/extract")
def extract_resume_skills(
    raw_text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Module B: Accepts resume text or file upload, extracts skills JSON,
    and saves skill profile to user's Neon PostgreSQL record.
    """
    text_content = ""
    if file:
        content = file.file.read()
        try:
            text_content = content.decode("utf-8")
        except UnicodeDecodeError:
            text_content = str(content)
    elif raw_text:
        text_content = raw_text
    else:
        text_content = "Python FastAPI SQL Docker Redis Git REST API"

    extracted_data = extract_skills_from_text(text_content)

    # Persist or update SkillProfile in Neon DB
    profile = db.query(SkillProfile).filter(SkillProfile.user_id == current_user.id).first()
    if not profile:
        profile = SkillProfile(
            user_id=current_user.id,
            skills=extracted_data["skills"],
            projects=extracted_data["projects"],
            experience=extracted_data["experience"],
            education=extracted_data["education"]
        )
        db.add(profile)
    else:
        profile.skills = extracted_data["skills"]
        profile.projects = extracted_data["projects"]
        profile.experience = extracted_data["experience"]
        profile.education = extracted_data["education"]

    db.commit()
    db.refresh(profile)

    return {
        "message": "Resume skill profile successfully extracted and saved to DB",
        "user_id": current_user.id,
        "extracted": extracted_data
    }

@router.post("/gap-analysis", response_model=List[SkillGapResponse])
def run_gap_analysis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Module C: Performs gap analysis against user's target role skill map
    and saves 'have' vs 'gap' items in Neon DB.
    """
    gaps = analyze_skill_gaps(current_user, db)
    return gaps

@router.get("/gap-analysis", response_model=List[SkillGapResponse])
def get_gap_analysis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    gaps = db.query(SkillGap).filter(SkillGap.user_id == current_user.id).all()
    if not gaps:
        gaps = analyze_skill_gaps(current_user, db)
    return gaps
