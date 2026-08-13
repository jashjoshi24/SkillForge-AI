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
**Team size:** 3 | **Member 3 (Frontend & Deployment Lead):** Web App UI, Skill Cartography System, Terrain Map Engine, Chart.js Analytics & Vercel Deployment.

---

## 🗺️ Product Concept — "Skill Cartography"
Most career platforms display generic lists of recommendations. **SkillForge AI** treats your career path as physical terrain and the platform as your surveying instrument:
- **Skills** = Elevation & Topographic Peaks
- **Skill Gaps** = Uncharted Terrain
- **Roadmap** = Sequential Waypoint Route
- **Progress** = Real-time Terrain Growth & Elevation recalculation

---

## 🛠️ Architecture & Tech Stack

| Layer | Choice | Purpose |
|---|---|---|
| Frontend | React + Vite | Fast modern single-page web app |
| Styling | Tailwind CSS v4 + Blueprint Design System | Skill Cartography styling (`#10243E` Ink, `#16324F` Line, `#EDEDE3` Chalk, `#C89B3C` Brass, `#6B9080` Sage, `#B5563C` Rust) |
| Typography | Google Fonts | `Space Grotesk` (Headings), `IBM Plex Sans` (Body), `IBM Plex Mono` (Coordinates/Metrics) |
| Signature Map | SVG Topographic Engine | Dynamic contour rings, coordinate pins & live elevation growth |
| Analytics | Chart.js (`react-chartjs-2`) | Skill acquisition timeline & target role radar gap chart |
| State & Demo | React Context API | Global state + dual-mode switch (Standalone Demo vs Live FastAPI) |

---

## 🚀 Quick Start & Local Setup

```bash
# 1. Clone repo & navigate into frontend directory
cd skillforge-ai

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build production bundle
npm run build
```

---

## 💡 Key Features Implemented (Member 3 Slice)
1. **Topographic Hero Preview**: Interactive survey preview on the landing page.
2. **Resume Upload & AI Scanner HUD**: Drag-and-drop uploader with technical scanline animation.
3. **Editable AI Extraction Review**: Review form allowing users to add, edit, or delete extracted technical skills, experience, and projects.
4. **Weighted Skill Gap Analysis**: Comparison of achieved skills (Contour Sage) vs uncharted gaps (Rust Flag) with target match % metric.
5. **Blueprint Grid Roadmap**: Sequential 4-phase route (Foundations → Core Skills → Projects → Interview Prep) with collapsible waypoints and status checkboxes.
6. **Dynamic Skill Terrain Growth**: Toggling roadmap items recalculates elevation and expands contour rings in real-time.
7. **AI Recommendations Engine**: Difficulty-tagged project ideas matched to gaps, curated certification directory, and interview question bank with sample answers.
8. **Engineering Field Log Dashboard**: Chart.js timeline and radar charts skinned in Blueprint tokens, plus ruler gauge progress indicators.
9. **Dual-Mode Demo/API Switcher**: Works offline with zero backend dependencies or connects smoothly to FastAPI backend endpoints.

Hack Orbit 2026 — Track 1 (AI & Human Augmentation), PS-01. Turns a resume into a
personalized, AI-generated skill gap analysis and multi-phase learning roadmap.

## Status

**Member 1 (Data & Intelligence Lead) pipeline is implemented end-to-end:**
Resume Upload → AI Skill Extraction → Editable Review → Skill Gap Analysis →
AI Roadmap Generation → Persistence, plus the shared FastAPI app skeleton,
database models, and Alembic migrations everyone builds on.

Module A (real Auth), Module E (Recommendations), Module F (Progress/Dashboard),
and the landing page/full app shell are **not yet implemented** — those are
Member 2 and Member 3's modules. A minimal dev-auth stub (see
`backend/app/dependencies.py`) lets Member 1's routes work today without
blocking on real auth; swapping it for Module A later is a one-function change.

## Repository layout

```
backend/          FastAPI app — all modules live here as routers on ONE app
  app/
    main.py           App entrypoint, CORS, error handlers, router registration
    config.py          Environment-based settings (never hard-coded secrets)
    database.py         NeonDB/PostgreSQL SQLAlchemy engine + session
    models.py            Shared schema: User, SkillProfile, Roadmap, RoadmapItem,
                          Recommendation, Progress — single source of truth
    dependencies.py       Dev-auth stub (get_current_user) — swap for real auth later
    schemas/              Pydantic request/response contracts
    routers/               /extract, /gap-analysis, /roadmap endpoints
    services/                Business logic: resume parsing, LLM client,
                              extraction/gap-analysis/roadmap orchestration
    prompts/                   Extraction + roadmap LLM prompts
    data/                        Hardcoded skill maps for 6 target roles
  alembic/            Migrations (schema lives in code, not the DB dashboard)
  tests/               pytest/unittest suite (see Testing below)
frontend/          React + Vite + Tailwind — "Skill Cartography" design system
  src/
    theme/global.css      Blueprint palette design tokens
    api/client.js           Backend API client (no AI/DB calls from the frontend)
    components/              Shared loading/error/empty states, status chips
    pages/                     Upload → Review → Gap Analysis → Roadmap screens
```

## Backend setup

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then fill in DATABASE_URL and AI_API_KEY
alembic upgrade head
uvicorn app.main:app --reload
```

Open http://localhost:8000/docs for interactive OpenAPI docs, or
http://localhost:8000/health for a liveness check that also reports whether
`DATABASE_URL` / `AI_API_KEY` are configured.

### Required environment variables (`backend/.env`)

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | NeonDB/PostgreSQL connection string. Use your own Neon dev branch while developing — never point at `main` for local testing. |
| `AI_PROVIDER` | `gemini` or `anthropic`. Selects which LLM backs resume extraction + roadmap generation — see `app/services/llm_client.py`. |
| `AI_API_KEY` | API key for whichever `AI_PROVIDER` is set. Never exposed to the frontend; every LLM call happens behind `backend/app/services/llm_client.py`. |
| `AI_MODEL` | Model id for the selected provider (e.g. `gemini-3.6-flash` or `claude-sonnet-4-5-20250929`). |
| `JWT_SECRET` | Reserved for Module A's real auth. |
| `AUTH_DEV_MODE` | `true` while Module A isn't implemented — see dev-auth stub note above. |
| `FRONTEND_ORIGIN` | CORS allow-list, e.g. `http://localhost:5173`. |

See `backend/.env.example` for the full list with placeholders.

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL to your backend
npm run dev
```

## API contract (Member 1's routes)

- `POST /extract/upload` — multipart resume file → AI-extracted `ExtractedProfile` (not yet saved)
- `POST /extract/confirm` — user-reviewed profile → persisted `SkillProfile`
- `GET /extract/profile` — the current user's persisted skill profile
- `GET /gap-analysis?target_role=...` — have/gap skill comparison with priority scoring
- `POST /roadmap/generate` — `{target_role, current_level}` → persisted 4-phase roadmap
- `GET /roadmap` / `GET /roadmap/{id}` — fetch a persisted roadmap

Full request/response schemas are in `backend/app/schemas/` and served live via
`/docs`. Supported target roles: Backend Developer, Frontend Developer, Data
Analyst, ML Engineer, DevOps Engineer, Cybersecurity Analyst.

## Database

Schema is defined once in `backend/app/models.py` and version-controlled via
Alembic migrations (`backend/alembic/versions/`). Never hand-edit the Neon
schema — generate a migration instead:

```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```

Per the team's Neon branching strategy: each member develops against their
own dev branch (`dev-member1`, `dev-member2`, `dev-member3`); only merge a
migration against `main` once it's stable, and post in the group chat first.

## Testing

```bash
cd backend
pip install -r requirements.txt
pytest                      # full suite: unit + API-level tests
python3 -m unittest discover -s tests -p "test_resume_parser.py test_extraction_service.py test_gap_analysis_service.py test_roadmap_service.py test_schemas.py"
```

The pure-logic suite (`test_resume_parser.py`, `test_extraction_service.py`,
`test_gap_analysis_service.py`, `test_roadmap_service.py`, `test_schemas.py`)
has no FastAPI/SQLAlchemy dependency and runs anywhere Python + the packages
those specific modules use are available. The API-level suite
(`test_api_*.py`) additionally needs `fastapi`, `sqlalchemy`, and a reachable
PostgreSQL instance (`TEST_DATABASE_URL` env var, defaults to a local one —
never points at Neon `main`).

## Deployment

Not yet wired up — per the project docs this is Member 3's responsibility
(Vercel for `frontend/`, Railway/Render for `backend/`, with `DATABASE_URL`
and `AI_API_KEY` set as platform env vars).
