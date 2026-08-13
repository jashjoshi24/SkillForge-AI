# Deployment Guide — SkillForge AI (Frontend & Backend Coordination)

This guide outlines step-by-step instructions for deploying the **SkillForge AI** platform to production for hackathon judges.

---

## 1. Frontend Deployment (Vercel)

### Option A: Vercel CLI (Recommended)
```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Deploy from the project root
cd skillforge-ai
vercel

# 3. Deploy to Production
vercel --prod
```

### Option B: Vercel Dashboard (GitHub Integration)
1. Push `skillforge-ai` codebase to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com) → **New Project**.
3. Import the GitHub repository.
4. Framework Preset: **Vite**.
5. Environment Variables:
   - `VITE_API_BASE_URL` = `https://your-railway-backend.up.railway.app`
6. Click **Deploy**.

---

## 2. Environment Variables (`.env`)

Create `.env` in the root of `skillforge-ai`:

```env
# URL of Member 1 & 2's FastAPI Backend (Railway/Render)
VITE_API_BASE_URL=http://localhost:8000
```

---

## 3. Backend Deployment Coordination (Railway / Render)
1. Member 1 & 2 deploy FastAPI to Railway or Render.
2. Provide the live PostgreSQL / Neon database connection string in Railway secrets.
3. Pass Railway public domain URL (e.g. `https://skillforge-api.up.railway.app`) to Member 3 for `VITE_API_BASE_URL`.

---

## 4. Verification Checklist Before Submission
- [x] `npm run build` compiles cleanly without JSX or syntax errors.
- [x] Demo Mode switch operates standalone without requiring local API server.
- [x] Interactive Topographic Terrain Map updates elevation on roadmap toggles.
- [x] Chart.js charts render properly in Blueprint theme tokens.
- [x] Responsive layout tested on desktop, tablet, and mobile viewpoints.
