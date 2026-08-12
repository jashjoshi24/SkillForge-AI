# SkillForge AI — Personalized Learning & Career Mentor

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
