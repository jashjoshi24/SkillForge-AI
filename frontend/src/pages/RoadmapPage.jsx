import { useState } from "react";

import { api, ApiError } from "../api/client.js";
import { EmptyState, ErrorState, LoadingState } from "../components/StatusStates.jsx";
import StatusChip from "../components/StatusChip.jsx";

const LEVELS = ["beginner", "intermediate", "advanced"];

export default function RoadmapPage({ gapResult }) {
  const [currentLevel, setCurrentLevel] = useState("beginner");
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [error, setError] = useState(null);
  const [roadmap, setRoadmap] = useState(null);

  const generate = async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await api.generateRoadmap(gapResult.target_role, currentLevel);
      setRoadmap(data);
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setError(e instanceof ApiError ? e.message : "Couldn't generate your roadmap. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-accent-brass">Module D · Charted Route</p>
        <h1 className="font-display text-3xl font-bold">Your route to {gapResult.target_role_label}</h1>
        <p className="text-text-muted">
          Grounded in your {gapResult.gap_skills.length} highest-priority gap skill
          {gapResult.gap_skills.length === 1 ? "" : "s"} — not a generic curriculum.
        </p>
      </header>

      {status !== "done" && (
        <div className="flex flex-wrap items-end gap-3 rounded-card border border-bg-surface bg-bg-surface/60 p-4">
          <label className="block text-sm">
            <span className="mb-1 block font-mono text-xs uppercase tracking-wide text-text-muted">Current level</span>
            <select
              value={currentLevel}
              onChange={(e) => setCurrentLevel(e.target.value)}
              className="rounded-card border border-text-muted/30 bg-bg-primary px-3 py-2 text-text-primary"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={generate}
            className="rounded-card bg-accent-brass px-5 py-2 font-display font-semibold text-bg-primary hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-brass"
          >
            Generate roadmap
          </button>
        </div>
      )}

      {status === "loading" && <LoadingState message="Surveying the best route for your target role…" />}
      {status === "error" && <ErrorState message={error} onRetry={generate} />}
      {status === "idle" && (
        <EmptyState title="No route charted yet" message="Set your current level and generate your personalized roadmap." />
      )}

      {status === "done" && roadmap && (
        <ol className="relative space-y-8 border-l-2 border-bg-surface pl-8">
          {roadmap.phases.map((phase, phaseIdx) => (
            <li key={phase.phase} className="relative">
              <span className="absolute -left-[41px] flex h-8 w-8 items-center justify-center rounded-full border-2 border-accent-brass bg-bg-primary font-mono text-xs font-semibold text-accent-brass">
                {String(phaseIdx + 1).padStart(2, "0")}
              </span>
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-accent-brass">
                Phase {String(phaseIdx + 1).padStart(2, "0")} · {phase.phase}
              </p>
              <div className="space-y-3">
                {phase.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="rounded-card border border-bg-surface bg-bg-surface/60 p-4">
                    <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-display text-base font-semibold">{item.title}</h3>
                      <StatusChip variant={item.status || "not_started"} />
                    </div>
                    <p className="mb-2 text-sm text-text-muted">{item.description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono text-text-muted">{item.estimated_time}</span>
                      {item.skills.map((s) => (
                        <span key={s} className="rounded-pill border border-accent-sage/40 px-2 py-0.5 text-accent-sage">
                          {s}
                        </span>
                      ))}
                    </div>
                    {item.resources?.length > 0 && (
                      <ul className="mt-2 space-y-1 text-xs text-text-muted">
                        {item.resources.map((r, i) => (
                          <li key={i}>
                            📎{" "}
                            {r.url ? (
                              <a href={r.url} target="_blank" rel="noreferrer" className="underline hover:text-accent-brass">
                                {r.title}
                              </a>
                            ) : (
                              r.title
                            )}{" "}
                            <span className="font-mono">({r.type})</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
