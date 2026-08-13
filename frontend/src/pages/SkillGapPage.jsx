import { useState } from "react";

import { api, ApiError, TARGET_ROLES } from "../api/client.js";
import { EmptyState, ErrorState, LoadingState } from "../components/StatusStates.jsx";
import StatusChip from "../components/StatusChip.jsx";

export default function SkillGapPage({ onAnalyzed }) {
  const [targetRole, setTargetRole] = useState(TARGET_ROLES[0].value);
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const runAnalysis = async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await api.getGapAnalysis(targetRole);
      setResult(data);
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setError(e instanceof ApiError ? e.message : "Couldn't run the gap analysis. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-accent-brass">Module C · Terrain Survey</p>
        <h1 className="font-display text-3xl font-bold">Where you stand vs. your target role</h1>
        <p className="text-text-muted">
          We'll compare your confirmed skill profile against what a {""}
          <span className="text-text-primary">{TARGET_ROLES.find((r) => r.value === targetRole)?.label}</span>{" "}
          role typically requires.
        </p>
      </header>

      <div className="flex flex-wrap items-end gap-3 rounded-card border border-bg-surface bg-bg-surface/60 p-4">
        <label className="block text-sm">
          <span className="mb-1 block font-mono text-xs uppercase tracking-wide text-text-muted">Target role</span>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="rounded-card border border-text-muted/30 bg-bg-primary px-3 py-2 text-text-primary"
          >
            {TARGET_ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={runAnalysis}
          className="rounded-card bg-accent-brass px-5 py-2 font-display font-semibold text-bg-primary hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-brass"
        >
          Analyze gap
        </button>
      </div>

      {status === "loading" && <LoadingState message="Mapping your current skills…" />}
      {status === "error" && <ErrorState message={error} onRetry={runAnalysis} />}
      {status === "idle" && (
        <EmptyState
          title="No survey run yet"
          message="Pick a target role and run the analysis to see your matched skills and gaps."
        />
      )}

      {status === "done" && result && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-card border border-bg-surface bg-bg-surface/60 p-5">
            <span className="font-mono text-3xl font-semibold text-accent-brass">{result.match_percentage}%</span>
            <span className="text-sm text-text-muted">MATCHED to {result.target_role_label}</span>
          </div>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold">Matched skills</h2>
            {result.matched_skills.length === 0 ? (
              <p className="text-sm text-text-muted">No matches yet — every requirement below is a gap.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {result.matched_skills.map((m) => (
                  <StatusChip key={m.skill} variant="matched">
                    {m.skill}
                  </StatusChip>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold">Prioritized gaps</h2>
            <div className="space-y-2">
              {result.prioritized_gaps.map((g) => (
                <div
                  key={g.skill}
                  className="flex items-center justify-between rounded-card border border-accent-rust/30 bg-accent-rust/5 px-4 py-2"
                >
                  <span className="text-sm">{g.skill}</span>
                  <div className="flex items-center gap-2">
                    {g.importance === "critical" && <StatusChip variant="priority">Critical</StatusChip>}
                    <StatusChip variant="gap">{g.importance.replace("_", " ")}</StatusChip>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end pb-8">
            <button
              type="button"
              onClick={() => onAnalyzed(result)}
              className="rounded-card bg-accent-brass px-6 py-3 font-display font-semibold text-bg-primary hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-brass"
            >
              Generate my roadmap →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
