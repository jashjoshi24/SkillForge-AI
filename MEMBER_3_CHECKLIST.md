# Member 3 (Frontend & Deployment Lead) — Task Checklist & Execution Guide
### SkillForge AI — Hack Orbit 2026 — Track 1 (PS-01)

As **Member 3**, you own the complete user interface, visual branding, signature topographic map component, analytics charts, and deployment pipeline.

---

## 📌 COMPLETED CODEBASE & VERIFICATION TASKS

### Phase 1: Local Application Verification & Build (Completed ✅)
- [x] Run `npm run build` and ensure 0 compilation errors (**Verified: Vite built 1813 modules with 0 errors**).
- [x] Verify design tokens (Blueprint Ink `#10243E`, Line `#16324F`, Chalk `#EDEDE3`, Brass `#C89B3C`, Sage `#6B9080`, Rust `#B5563C`).
- [x] Test responsive layout on Desktop (1440px), Tablet (768px), and Mobile (375px).
- [x] Test Standalone Demo Mode vs Live FastAPI API Mode toggle in Navbar.
- [x] Verify real-time topographic terrain map elevation growth on roadmap checkmarks (with celebratory confetti).
- [x] Backend resume parser equipped with `pdfplumber` and `python-docx` text extraction logic in `backend/main.py`.

### Phase 2: Deployment Configuration Setup (Completed ✅)
- [x] Created `vercel.json` for SPA URL rewrites on Vercel.
- [x] Created `backend/Dockerfile` for Dockerized FastAPI deployment on Railway/Render.
- [x] Configured CORS middleware & SQLite/PostgreSQL Database connection via SQLAlchemy in `backend/main.py`.

---

## 📌 ACTIONABLE EXTERNAL DEPLOYMENT & SUBMISSION STEPS FOR YOUR TEAM

### Step 1: Deploy Frontend to Vercel
1. Login to [Vercel](https://vercel.com).
2. Click **Add New Project** → Import `SkillForge-AI` repository.
3. Framework Preset: **Vite**.
4. Set Environment Variable: `VITE_API_BASE_URL` = `https://your-railway-backend.up.railway.app` (or leave default for Standalone Demo Mode).
5. Click **Deploy**.

### Step 2: Deploy Backend to Railway / Render
1. Login to [Railway](https://railway.app) or [Render](https://render.com).
2. Click **New Project** → **Deploy from GitHub repo** → select `backend/` directory.
3. Set Environment Variables:
   - `DATABASE_URL` (from Neon Postgres or Railway Postgres plugin)
   - `OPENAI_API_KEY` (Optional for LLM calls)

### Step 3: Record 3-Minute Video Demo & Final Submission
1. **Record 3-Minute Video Demo**:
   - **0:00 - 0:30**: Introduce concept (*"Your career is terrain, SkillForge AI is your surveying instrument"*). Show Landing Page hero terrain map.
   - **0:30 - 1:15**: Select target role (`Cybersecurity Specialist`), click "Use Sample Resume", show scanning animation HUD, and demonstrate the Editable AI Extraction Review form.
   - **1:15 - 2:00**: Show Skill Gap comparison (Achieved Sage vs Uncharted Rust) and Blueprint Roadmap route.
   - **2:00 - 2:30**: Check off a roadmap item ("Active Directory Attacks") to fire celebratory confetti and demonstrate dynamic terrain map elevation growth.
   - **2:30 - 3:00**: Highlight AI Recommendations tab (Projects, Certifications, Interview Qs) and Chart.js Analytics Field Log dashboard.
2. **Submit Hackathon Google Form**:
   - GitHub Repository Link
   - Live Deployed Frontend URL (Vercel)
   - Live Deployed Backend API URL (Railway)
   - 3-Minute YouTube / Google Drive Demo Video Link
   - 1-Page Project Abstract

---

## 🛠️ Local Commands Reference

```powershell
# Run frontend locally
npm run dev

# Build production bundle
npm run build

# Run FastAPI backend locally
cd backend
python main.py
```
