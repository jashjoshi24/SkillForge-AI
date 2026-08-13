# SkillForge AI — Personalized Learning & Career Mentor
### Hack Orbit 2026 — Track 1 (AI & Human Augmentation) — PS-01
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
