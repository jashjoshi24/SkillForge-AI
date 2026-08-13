"""
Auth dependency contract.

Module A (real signup/login) is owned by Member 2 and is not implemented
yet in this repository. Per the project docs' contract-first workflow,
Member 1's modules must not block on that — this file provides a clean,
temporary development interface that satisfies the same contract a real
auth dependency will: given a request, resolve the current `User` row and
hand back its id.

How it works today (AUTH_DEV_MODE=true, the default):
  - The frontend/tests may send an `X-Dev-User-Email` header to act as a
    specific user (useful for multi-user testing of data isolation).
  - If no header is sent, it falls back to `settings.DEV_USER_EMAIL`.
  - The user row is looked up, or lazily created, on first use.

When Member 2 ships real auth:
  - Replace the body of `get_current_user` with real JWT/session
    verification and delete `_resolve_dev_user`.
  - Every router in this codebase depends on `get_current_user` via
    FastAPI's dependency injection (`Depends(get_current_user)`), so the
    swap is a one-function change — no route/service code needs to change.
"""
from fastapi import Depends, Header
from sqlalchemy.orm import Session

from app.config import get_settings
from app.core.exceptions import SkillForgeError
from app.database import get_db
from app.models import User

settings = get_settings()


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
    x_dev_user_email: str | None = Header(default=None, alias="X-Dev-User-Email"),
) -> User:
    if not settings.AUTH_DEV_MODE:
        # Real auth is expected to be wired in by Module A. Fail loudly
        # rather than silently granting access.
        raise SkillForgeError(
            "AUTH_DEV_MODE is disabled but no real authentication dependency "
            "has been wired in yet. Set AUTH_DEV_MODE=true for development, "
            "or integrate Module A's auth dependency here.",
        )
    email = x_dev_user_email or settings.DEV_USER_EMAIL
    return _resolve_dev_user(db, email)
