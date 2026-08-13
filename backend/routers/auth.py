from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, SkillProfile
from backend.auth.security import get_password_hash, verify_password, create_access_token
from backend.auth.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth & Profile"])

# --- Schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    target_role: Optional[str] = "Backend Developer"
    education_level: Optional[str] = "Bachelor's Student"
    interests: Optional[List[str]] = []
    goals: Optional[List[str]] = []

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    target_role: Optional[str] = None
    education_level: Optional[str] = None
    interests: Optional[List[str]] = None
    goals: Optional[List[str]] = None

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    target_role: str
    education_level: str
    interests: List[str]
    goals: List[str]

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# --- Routes ---

@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    hashed_pwd = get_password_hash(user_in.password)
    user = User(
        email=user_in.email,
        password_hash=hashed_pwd,
        name=user_in.name,
        target_role=user_in.target_role or "Backend Developer",
        education_level=user_in.education_level or "Bachelor's Student",
        interests=user_in.interests or [],
        goals=user_in.goals or []
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Initialize empty skill profile for user
    profile = SkillProfile(user_id=user.id, skills=[], projects=[], experience=[], education=[])
    db.add(profile)
    db.commit()

    token = create_access_token(data={"sub": user.email, "id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login", response_model=TokenResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    token = create_access_token(data={"sub": user.email, "id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_in.name is not None:
        current_user.name = profile_in.name
    if profile_in.target_role is not None:
        current_user.target_role = profile_in.target_role
    if profile_in.education_level is not None:
        current_user.education_level = profile_in.education_level
    if profile_in.interests is not None:
        current_user.interests = profile_in.interests
    if profile_in.goals is not None:
        current_user.goals = profile_in.goals

    db.commit()
    db.refresh(current_user)
    return current_user
