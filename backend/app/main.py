"""
SkillForge AI backend — single shared FastAPI app.

Per the project docs (Section 12): "all three modules are routes inside
ONE FastAPI app (/auth, /extract, /gap-analysis, /roadmap, /recommendations,
/progress), not three separate services." This file wires up Member 1's
routes (Module B/C/D). Members 2 and 3 add their routers the same way
(`app.include_router(...)`) rather than standing up separate apps.
"""
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.core.exceptions import register_exception_handlers
from app.core.logging_config import configure_logging
from app.routers import gap_analysis, resume, roadmap

configure_logging()
logger = logging.getLogger("skillforge.main")

settings = get_settings()

app = FastAPI(
    title="SkillForge AI API",
    description=(
        "Personalized Learning & Career Mentor — backend API. "
        "Member 1 modules: Resume Extraction (/extract), Skill Gap Analysis "
        "(/gap-analysis), and AI Roadmap Generation (/roadmap)."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

app.include_router(resume.router)
app.include_router(gap_analysis.router)
app.include_router(roadmap.router)


@app.get("/health", tags=["Health"], summary="Liveness/readiness check")
def health():
    from app.database import engine

    db_configured = engine is not None
    return {
        "status": "ok",
        "environment": settings.ENVIRONMENT,
        "database_configured": db_configured,
        "ai_provider": settings.AI_PROVIDER,
        "ai_configured": bool(settings.AI_API_KEY),
    }


@app.on_event("startup")
async def on_startup():
    logger.info("SkillForge AI backend starting (environment=%s)", settings.ENVIRONMENT)
    if not settings.DATABASE_URL:
        logger.warning("DATABASE_URL is unset — set it in backend/.env before using any persisted endpoint.")
    if not settings.AI_API_KEY:
        logger.warning("AI_API_KEY is unset — extraction and roadmap generation will fail until it is set.")
