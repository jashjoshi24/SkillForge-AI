import { useState } from "react";

import ExtractionReviewPage from "./pages/ExtractionReviewPage.jsx";
import ResumeUploadPage from "./pages/ResumeUploadPage.jsx";
import RoadmapPage from "./pages/RoadmapPage.jsx";
import SkillGapPage from "./pages/SkillGapPage.jsx";

/**
 * Member 1's pipeline as a standalone step flow: Upload -> Review -> Gap ->
 * Roadmap. Wired against the real /extract, /gap-analysis, and /roadmap
 * contracts so Member 3 can drop these screens into the full app shell
 * (landing page, auth, dashboard) without changing how they talk to the
 * backend. Kept dependency-light (no router) so this flow works standalone
 * during parallel development, per the project docs' contract-first
 * workflow (Section 12).
 */
const STEPS = ["upload", "review", "gap", "roadmap"];
const STEP_LABELS = {
  upload: "Upload",
  review: "Review",
  gap: "Gap Analysis",
  roadmap: "Roadmap",
};

export default function App() {
  const [step, setStep] = useState("upload");
  const [extraction, setExtraction] = useState(null);
  const [sourceFilename, setSourceFilename] = useState(null);
  const [gapResult, setGapResult] = useState(null);

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="border-b border-bg-surface px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <span className="font-display text-lg font-bold tracking-tight">SKILLFORGE</span>
          <nav aria-label="Pipeline progress" className="flex items-center gap-2 font-mono text-xs uppercase text-text-muted">
            {STEPS.map((s, i) => (
              <span key={s} className={`flex items-center gap-2 ${s === step ? "text-accent-brass" : ""}`}>
                {i > 0 && <span aria-hidden="true">→</span>}
                {STEP_LABELS[s]}
              </span>
            ))}
          </nav>
        </div>
      </header>

      <main className="px-6 py-10">
        {step === "upload" && (
          <ResumeUploadPage
            onExtracted={(result, filename) => {
              setExtraction(result);
              setSourceFilename(filename);
              setStep("review");
            }}
          />
        )}

        {step === "review" && extraction && (
          <ExtractionReviewPage
            extraction={extraction}
            sourceFilename={sourceFilename}
            onConfirmed={() => setStep("gap")}
          />
        )}

        {step === "gap" && (
          <SkillGapPage
            onAnalyzed={(result) => {
              setGapResult(result);
              setStep("roadmap");
            }}
          />
        )}

        {step === "roadmap" && gapResult && <RoadmapPage gapResult={gapResult} />}
      </main>
    </div>
  );
}
