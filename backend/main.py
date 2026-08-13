from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.database import engine, Base
from backend.routers import auth, extraction, roadmap, recommendations, progress

# Initialize Database tables on Neon Postgres
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SkillForge AI - Unified Backend API (Hack Orbit 2026)"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register All Module Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(extraction.router, prefix=settings.API_V1_STR)
app.include_router(roadmap.router, prefix=settings.API_V1_STR)
app.include_router(recommendations.router, prefix=settings.API_V1_STR)
app.include_router(progress.router, prefix=settings.API_V1_STR)

@app.get("/")
def root_check():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "database": "Neon PostgreSQL (Connected & Synced)",
        "modules": {
            "Module A (Auth & Profile)": "/api/auth",
            "Module B (Resume Skill Extraction)": "/api/extract",
            "Module C (Skill Gap Analysis)": "/api/gap-analysis",
            "Module D (AI Roadmap Generator)": "/api/roadmap",
            "Module E (Recommendations Engine)": "/api/recommendations",
            "Module F (Progress Tracking & Terrain Map)": "/api/progress"
        }
    }
