"""
Auth dependency contract.

Real signup/login (Module A) now lives in app/core/security.py and
app/routers/auth.py: `POST /auth/signup` and `POST /auth/login` issue a
JWT, and `get_current_user` below accepts it as a standard
`Authorization: Bearer <token>` header.

A dev-mode fallback is kept for local development and the existing test
suite so nobody is blocked on having a real account yet:
  - If a valid `Authorization: Bearer <token>` header is present, it wins
    and resolves the real user it names.
  - Otherwise, when AUTH_DEV_MODE=true (the default), the frontend/tests
    may send an `X-Dev-User-Email` header to act as a specific user
    (useful for multi-user testing of data isolation); if no header is
    sent, it falls back to `settings.DEV_USER_EMAIL`. The user row is
    looked up, or lazily created, on first use.
  - When AUTH_DEV_MODE=false and no valid token is supplied, the request
    is rejected.

Every router in this codebase depends on `get_current_user` via FastAPI's
dependency injection (`Depends(get_current_user)`), so both paths are
transparent to route/service code.
"""
from fastapi import Depends, Header
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.config import get_settings
from app.core.exceptions import AuthError, SkillForgeError
from app.core.security import decode_access_token
from app.database import get_db
from app.models import User

settings = get_settings()

# auto_error=False: a missing/absent Authorization header should fall
# through to the dev-mode path below instead of FastAPI raising a 403.
_bearer_scheme = HTTPBearer(auto_error=False)


def _resolve_dev_user(db: Session, email: str) -> User:
    user = db.query(User).filter(User.email == email).one_or_none()
    if user is None:
        user = User(email=email, name=email.split("@")[0])
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def get_current_user(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
    x_dev_user_email: str | None = Header(default=None, alias="X-Dev-User-Email"),
) -> User:
    if credentials is not None:
        email = decode_access_token(credentials.credentials)
        if email is None:
            raise AuthError("Invalid or expired authentication token.")
        user = db.query(User).filter(User.email == email).one_or_none()
        if user is None:
            raise AuthError("This token's account no longer exists.")
        return user

    if not settings.AUTH_DEV_MODE:
        raise SkillForgeError(
            "AUTH_DEV_MODE is disabled and no valid Authorization header was "
            "provided. Log in via POST /auth/login and send the returned "
            "token as 'Authorization: Bearer <token>'.",
        )
    email = x_dev_user_email or settings.DEV_USER_EMAIL
    return _resolve_dev_user(db, email)
