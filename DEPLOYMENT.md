# Deploying SkillForge AI — Vercel (frontend) + Render (backend)

This replaces the old draft of this file (which referenced Railway and a
`skillforge-ai` folder name that doesn't match this repo). It reflects how
the project actually runs today: a Vite/React frontend at the repo root,
and a FastAPI backend in `backend/` talking to a NeonDB (Postgres) database.

Do the cleanup in Part 0 once, before your first deploy — it removes the
duplicate frontend and dead backend files that have been causing confusion,
without touching anything the running app actually uses.

---

## Part 0 — One-time cleanup (do this first)

These files were never used by the app that actually runs (`npm run dev` at
the repo root + `backend/app/`) — they're leftovers from early scaffolding.
Deleting them removes the ambiguity, it does not change any behavior.

**Delete the entire `frontend/` folder** (`E:\SkillForge-AI\frontend`). It's
a second, older, unstyled copy of the frontend — not the one that runs when
you do `npm run dev` from the repo root. Keeping both around is exactly what
caused "the wrong frontend is running" earlier.

**Delete these files/folders inside `backend/`** — all dead duplicates of
the real code in `backend/app/`:
- `models.py`, `config.py`, `database.py` (top-level — the real ones are in
  `backend/app/`)
- `auth/` (top-level — the real one is `backend/app/core/security.py` +
  `backend/app/dependencies.py`)
- `routers/` (top-level — the real one is `backend/app/routers/`)
- `services/` (top-level — the real one is `backend/app/services/`)
- `seed.py`
- `test_full_project_apis.py`, `test_member2_apis.py` (already excluded from
  test runs by `pytest.ini`, but they're dead weight)
- `.env.backup`

Easiest way (PowerShell, from `E:\SkillForge-AI`):
```powershell
Remove-Item -Recurse -Force frontend
Remove-Item -Recurse -Force backend\auth, backend\routers, backend\services
Remove-Item -Force backend\models.py, backend\config.py, backend\database.py, backend\seed.py, backend\test_full_project_apis.py, backend\test_member2_apis.py, backend\.env.backup
```

After deleting, restart both servers once and confirm nothing broke:
```powershell
# Terminal 1
cd backend
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload

# Terminal 2 (repo root)
npm run dev
```
If anything doesn't start, don't worry — everything you deleted is still in
git history, so it's recoverable. But it shouldn't happen: nothing in
`backend/app/` or the root `src/` imports any of it.

Optional, purely cosmetic (safe to leave if you'd rather not bother): the
stray `venv/` folder and `requirements.txt` at the very repo root, and
`skillforge.db`, are leftovers too — `backend/` has its own `.venv` and
`requirements.txt` that are the ones actually used.

---

## Part 1 — Push to GitHub

Both Vercel and Render deploy from a GitHub repo, so commit and push first
(you're doing the committing yourself, as usual):
```powershell
git add -A
git commit -m "Clean up dead files, add deployment config"
git push
```
Double check `git status` shows no `.env` files staged — they're gitignored,
but worth a quick look before your first push of this repo if it's new.

---

## Part 2 — Deploy the backend to Render

### 2a. Get a production Neon database branch
You already have a Neon project from testing. In the [Neon
console](https://console.neon.tech), either use your `main` branch or create
a fresh `production` branch, then copy its **pooled** connection string
(Connection Details → shows a string starting `postgresql://...`). Change
`postgresql://` to `postgresql+psycopg2://` — that's the `DATABASE_URL`
you'll paste into Render in step 2b.

### 2b. Create the Render service
This repo already includes `render.yaml` at the root, which describes the
backend service for you (Python runtime, points at `backend/`, runs
`alembic upgrade head` on every boot, sets all the right env var names).

1. Go to the [Render Dashboard](https://dashboard.render.com).
2. **New +** → **Blueprint**.
3. Connect your GitHub account if you haven't, and select this repo.
4. Render reads `render.yaml` and shows one service: `skillforge-backend`.
   Click **Apply**.
5. It will prompt you for the env vars marked "sync: false" in
   `render.yaml` — fill these in:
   - `DATABASE_URL` — the Neon connection string from step 2a.
   - `AI_API_KEY` — your Gemini (or Anthropic) API key.
   - `FRONTEND_ORIGIN` — leave this blank for now, you'll set it in Part 4
     once you know your Vercel URL.
6. Click **Deploy**. First deploy takes a few minutes (installing
   `psycopg2`/`bcrypt` from source can be slow on the free tier — that's
   normal).
7. Once it's live, open `https://<your-service>.onrender.com/health` in a
   browser. You should see `{"status":"ok", ...}`. That URL is your backend
   URL — copy it, you need it next.

**Free-tier note:** Render's free web services spin down after ~15 minutes
of no traffic and take 30-60 seconds to wake back up on the next request.
Fine for a hackathon demo; mention it to judges if the first load is slow.

---

## Part 3 — Deploy the frontend to Vercel

1. Go to the [Vercel Dashboard](https://vercel.com) → **Add New** →
   **Project**.
2. Import this same GitHub repo.
3. Vercel auto-detects **Vite** as the framework from `package.json` — leave
   Build Command / Output Directory on their defaults (`npm run build` /
   `dist`). Because the repo root is the frontend project, you do **not**
   need to set a "Root Directory" override.
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL` = your Render backend URL from Part 2, e.g.
     `https://skillforge-backend.onrender.com` (no trailing slash).
5. Click **Deploy**. When it finishes you'll get a URL like
   `https://skillforge-ai.vercel.app` — that's your live frontend.

---

## Part 4 — Connect them (CORS)

The backend only accepts browser requests from origins listed in its
`FRONTEND_ORIGIN` env var (see `backend/app/config.py`) — right now that's
still blank/localhost, so the deployed frontend's real API calls (login,
resume upload, etc.) will be blocked until you set it.

1. Back in the Render dashboard → your `skillforge-backend` service →
   **Environment**.
2. Set `FRONTEND_ORIGIN` to your Vercel URL from Part 3, e.g.
   `https://skillforge-ai.vercel.app` (no trailing slash). You can list more
   than one origin comma-separated if you also want to allow a Vercel
   preview URL.
3. Save — Render redeploys automatically with the new value (no code change
   needed).

---

## Part 5 — Verify end-to-end

1. Open your Vercel URL.
2. Toggle **API MODE** (off of Demo Mode) in the navbar.
3. Click **LOG IN** → **SIGN UP**, create an account.
4. Upload or use the sample resume, confirm the profile, and check that gap
   analysis / roadmap come back with real data (not the demo dataset).
5. Open the Network tab if anything looks off — a CORS error there almost
   always means Part 4 was skipped or the URL has a typo/trailing slash.

If something fails, `https://<your-backend>.onrender.com/docs` gives you the
live interactive API docs to test endpoints directly and narrow down
whether the problem is frontend or backend.
