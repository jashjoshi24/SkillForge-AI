# SkillForge AI — Personalized Learning & Career Mentor
### Hack Orbit 2026 — Track 1 (AI & Human Augmentation) — PS-01

**SkillForge AI** transforms career progression into an interactive, surveyed route. Skills are elevation, skill gaps are uncharted territory, and your personalized roadmap is a mapped blueprint route across terrain.

---

## Member 2 Deliverables (Auth, Profile, Recommendations & Progress Analytics)

### Module A — Auth & Profile Backend
- **User Signup & Login**: `POST /api/auth/signup` and `POST /api/auth/login` with bcrypt password hashing and JWT token authentication.
- **Profile Management**: `GET /api/auth/me` and `PUT /api/auth/profile` to view and update target role, education level, interests, and career goals.

### Module E — Recommendations Engine
- **AI Recommendation Engine**: `POST /api/recommendations/generate` to dynamically generate project ideas (with tech stack & step-by-step deliverables) and technical interview questions (with key concepts & sample answers) matched directly to user skill gaps.
- **Curated Certifications Dataset**: `GET /api/recommendations/certifications` serving industry credentials (AWS, CNCF, Oracle, Meta, Google, Microsoft, HashiCorp, CompTIA) filtered by domain.
- **Recommendation Status Management**: `GET /api/recommendations` and `PUT /api/recommendations/{id}/status` supporting status updates (`saved`, `in_progress`, `completed`, `ignored`).

### Module F — Progress Tracking & Dashboard Analytics
- **Dashboard Metrics & Summary**: `GET /api/progress/summary` computing overall completion %, phase progress breakdown, gap closure %, and recent activity log.
- **Chart.js Time-Series Data**: `GET /api/progress/skills-timeline` serving progression data formatted directly for Chart.js dashboard integration.
- **Skill Terrain Map Cartography State**: `GET /api/progress/terrain-state` computing dynamic elevation, contour levels, active peak skill nodes, and gap plain nodes for the signature cartography UI.
- **Roadmap Item Progress Tracker**: `PUT /api/progress/roadmap-items/{id}/status` to update item status (`not_started`, `in_progress`, `completed`) and automatically close associated skill gaps.

---

## File Structure

```
SkillForge-AI/
├── backend/
│   ├── auth/
│   │   ├── dependencies.py       # FastAPI HTTPBearer JWT security dependency
│   │   └── security.py           # Passlib/Bcrypt hashing & PyJWT token handler
│   ├── data/
│   │   └── certifications.py     # Curated domain certifications dataset
│   ├── routers/
│   │   ├── auth.py               # Auth & Profile endpoints (/api/auth)
│   │   ├── progress.py           # Analytics & Progress endpoints (/api/progress)
│   │   └── recommendations.py    # Recommendations Engine endpoints (/api/recommendations)
│   ├── services/
│   │   ├── analytics_service.py  # Dashboard calculations & Terrain Map state generator
│   │   └── recommendations_service.py # AI Project & Interview Question engine
│   ├── config.py                 # Application settings & secrets configuration
│   ├── database.py               # SQLAlchemy engine & session management
│   ├── main.py                   # FastAPI main app with CORS middleware
│   ├── models.py                 # ORM Database Models (User, SkillProfile, SkillGap, etc.)
│   ├── seed.py                   # Demo database seeder script
│   └── test_member2_apis.py      # Member 2 automated end-to-end API test suite
├── requirements.txt              # Backend dependencies
├── skillforge.db                 # SQLite database (auto-generated)
└── README.md                     # Project overview and documentation
```

---

## Quick Start & Verification

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Seed Database
Populate the database with a pre-configured demo user (`alex@skillforge.ai` / `password123`), skill gaps, sample roadmap items, recommendations, and activity logs:
```bash
python -m backend.seed
```

### 3. Run Automated API Test Suite
Run the test suite verifying all 11 Member 2 endpoints:
```bash
python -m backend.test_member2_apis
```

### 4. Launch FastAPI Server
Start the backend development server:
```bash
uvicorn backend.main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000/api`
- Interactive Swagger Documentation: `http://localhost:8000/docs`
