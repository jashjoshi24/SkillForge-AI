"""
Password hashing and JWT helpers for real authentication (Module A).

Reuses the `settings.JWT_SECRET` the dev-auth stub already reserved (see
app/dependencies.py) so no new environment variable is required to turn
real auth on — only AUTH_DEV_MODE needs to eventually flip to false.
"""
import logging
from datetime import datetime, timedelta, timezone

import jwt
from passlib.context import CryptContext

from app.config import get_settings

logger = logging.getLogger("skillforge.security")

settings = get_settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        # A malformed/legacy hash should fail the login, not crash the request.
        logger.warning("Password verification raised against a stored hash; treating as no-match.")
        return False


def create_access_token(subject: str) -> str:
    """`subject` is the user's email — stored in the JWT `sub` claim."""
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    payload = {"sub": subject, "iat": now, "exp": expire}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> str | None:
    """Returns the `sub` claim (user email) if the token is valid, else None."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except jwt.PyJWTError as exc:
        logger.info("JWT decode failed: %s", exc.__class__.__name__)
        return None
    return payload.get("sub")
