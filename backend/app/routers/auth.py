"""
Module A routes — account creation, login, and the current authenticated user.

    POST /auth/signup   create a User (+ empty SkillProfile), return a JWT
    POST /auth/login     verify credentials, return a JWT
    GET  /auth/me        the current user (real JWT, or the dev-mode stub
                          while AUTH_DEV_MODE=true — see app/dependencies.py)
"""
import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.exceptions import AuthError, ConflictError
from app.core.security import create_access_token, hash_password, verify_password
from app.database import get_db
from app.dependencies import get_current_user
from app.models import SkillProfile, User
from app.schemas.auth import LoginRequest, SignupRequest, TokenResponse, UserResponse

logger = logging.getLogger("skillforge.routers.auth")

router = APIRouter(prefix="/auth", tags=["Module A — Auth"])


@router.post("/signup", response_model=TokenResponse, summary="Create an account")
def signup(body: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == body.email).one_or_none()
    if existing is not None:
        raise ConflictError("An account with this email already exists.", detail={"field": "email"})

    user = User(email=body.email, name=body.name, hashed_password=hash_password(body.password))
    db.add(user)
    db.flush()  # populate user.id (client-side UUID default) before the FK insert below
    db.add(SkillProfile(user_id=user.id))
    db.commit()
    db.refresh(user)

    logger.info("New signup: user=%s", user.id)
    token = create_access_token(subject=user.email)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@router.post("/login", response_model=TokenResponse, summary="Log in with email + password")
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).one_or_none()
    if user is None or not user.hashed_password or not verify_password(body.password, user.hashed_password):
        raise AuthError("Incorrect email or password.")

    token = create_access_token(subject=user.email)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@router.get("/me", response_model=UserResponse, summary="Get the current authenticated user")
def me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)
