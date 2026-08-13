"""
Database engine / session configuration.

Required stack: NeonDB (serverless PostgreSQL) -> SQLAlchemy -> Alembic -> FastAPI.
DATABASE_URL always comes from the environment (see .env.example) and is never
hard-coded or logged.
"""
import logging

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import get_settings

logger = logging.getLogger("skillforge.database")

settings = get_settings()

if not settings.DATABASE_URL:
    logger.warning(
        "DATABASE_URL is not set. The app will start but any database "
        "operation will fail until a NeonDB connection string is provided "
        "in the environment (see backend/.env.example)."
    )


class Base(DeclarativeBase):
    """Shared declarative base — all SQLAlchemy models import this."""
    pass


def _build_engine():
    if not settings.DATABASE_URL:
        # Defer failure to first actual DB use rather than import time, so
        # `uvicorn app.main:app` and the OpenAPI docs still come up even
        # before a teammate has configured a database.
        return None
    connect_args = {}
    # Neon requires SSL; psycopg2 picks this up from the `sslmode=require`
    # query param already present in the recommended connection string, but
    # we set a safe default here too in case a bare URL is supplied.
    if "sslmode" not in settings.DATABASE_URL:
        connect_args["sslmode"] = "require"
    return create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,   # Neon serverless can idle connections out
        pool_recycle=300,
        connect_args=connect_args,
    )


engine = _build_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """FastAPI dependency that yields a scoped DB session per request."""
    if engine is None:
        from app.core.exceptions import ConfigurationError

        raise ConfigurationError(
            "DATABASE_URL is not configured. Set it in backend/.env (see .env.example)."
        )
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
