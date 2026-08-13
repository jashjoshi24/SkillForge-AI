# SkillForge AI — FastAPI Backend Service
### Backend Infrastructure for Member 1 & Member 2

This FastAPI backend service provides the database endpoints for:
- **Member 1**: Resume text parsing, LLM skill extraction (`/extract`), skill gap analysis (`/gap-analysis`), and roadmap generation (`/roadmap`).
- **Member 2**: Auth endpoints (`/auth/login`, `/auth/register`), recommendations engine (`/recommendations`), and progress tracking (`/progress`).

---

## 🏃 How to Run the Backend Locally

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Start the FastAPI development server
uvicorn main:app --reload --port 8000
```

The API interactive docs will be available at:
`http://localhost:8000/docs`

---

## 🗄️ Database Strategy (Neon PostgreSQL + SQLAlchemy)
- Set `DATABASE_URL` in `.env` or Railway environment variables:
  `DATABASE_URL=postgresql://user:password@ep-sample.neon.tech/neondb`
- `models.py` defines the SQLAlchemy schema (`User`, `SkillProfile`, `Roadmap`, `Recommendation`, `Progress`).
