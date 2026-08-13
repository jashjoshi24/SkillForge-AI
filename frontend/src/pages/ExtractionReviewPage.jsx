import { useState } from "react";

import { api, ApiError } from "../api/client.js";
import { ErrorState, LoadingState } from "../components/StatusStates.jsx";

const PROFICIENCIES = ["beginner", "intermediate", "advanced", "expert"];

function Field({ label, value, onChange, textarea }) {
  const Comp = textarea ? "textarea" : "input";
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-mono text-xs uppercase tracking-wide text-text-muted">{label}</span>
      <Comp
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={textarea ? 2 : undefined}
        className="w-full rounded-card border border-text-muted/30 bg-bg-primary px-3 py-2 text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-brass"
      />
    </label>
  );
}

function Section({ title, children, onAdd, addLabel }) {
  return (
    <section className="space-y-3 rounded-card border border-bg-surface bg-bg-surface/60 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="rounded-card border border-accent-brass/50 px-3 py-1 text-xs font-mono text-accent-brass hover:bg-accent-brass/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-brass"
          >
            + {addLabel}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

export default function ExtractionReviewPage({ extraction, sourceFilename, onConfirmed }) {
  const [profile, setProfile] = useState(extraction.profile);
  const [status, setStatus] = useState("idle"); // idle | saving | error
  const [error, setError] = useState(null);

  const updateList = (key, index, patch) => {
    setProfile((p) => ({
      ...p,
      [key]: p[key].map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };
  const removeItem = (key, index) => {
    setProfile((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== index) }));
  };
  const addItem = (key, blank) => {
    setProfile((p) => ({ ...p, [key]: [...p[key], blank] }));
  };

  const handleConfirm = async () => {
    setStatus("saving");
    setError(null);
    try {
      await api.confirmProfile(profile, sourceFilename);
      onConfirmed(profile);
    } catch (e) {
      setStatus("error");
      setError(e instanceof ApiError ? e.message : "Couldn't save your profile. Please try again.");
    }
  };

  if (status === "saving") return <LoadingState message="Saving your skill profile…" />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-accent-brass">Module B · Editable Review</p>
        <h1 className="font-display text-3xl font-bold">Review what we found</h1>
        <p className="text-text-muted">
          AI extracted this information from <span className="text-text-primary">{sourceFilename}</span>. Review
          and correct anything before saving it to your profile.
        </p>
        {extraction.warnings?.length > 0 && (
          <ul className="rounded-card border border-accent-brass/40 bg-accent-brass/10 p-3 text-xs text-accent-brass">
            {extraction.warnings.map((w, i) => (
              <li key={i}>⚠ {w}</li>
            ))}
          </ul>
        )}
      </header>

      <Section
        title="Skills"
        addLabel="Add skill"
        onAdd={() => addItem("skills", { name: "", category: null, proficiency: null, evidence: null })}
      >
        {profile.skills.length === 0 && <p className="text-sm text-text-muted">No skills detected yet — add some manually.</p>}
        <div className="flex flex-wrap gap-3">
          {profile.skills.map((s, i) => (
            <div key={i} className="flex items-center gap-2 rounded-card border border-text-muted/30 bg-bg-primary px-3 py-2">
              <input
                value={s.name}
                onChange={(e) => updateList("skills", i, { name: e.target.value })}
                aria-label={`Skill ${i + 1} name`}
                className="w-32 bg-transparent text-sm focus-visible:outline-none"
              />
              <select
                value={s.proficiency || ""}
                onChange={(e) => updateList("skills", i, { proficiency: e.target.value || null })}
                aria-label={`Skill ${i + 1} proficiency`}
                className="rounded bg-bg-surface font-mono text-xs text-text-muted"
              >
                <option value="">—</option>
                {PROFICIENCIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <button
                type="button"
                aria-label={`Remove ${s.name || "skill"}`}
                onClick={() => removeItem("skills", i)}
                className="text-accent-rust hover:text-accent-rust/70"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Projects"
        addLabel="Add project"
        onAdd={() => addItem("projects", { name: "", description: "", technologies: [], role: null, url: null })}
      >
        {profile.projects.length === 0 && <p className="text-sm text-text-muted">No projects detected.</p>}
        <div className="space-y-4">
          {profile.projects.map((proj, i) => (
            <div key={i} className="space-y-2 rounded-card border border-text-muted/20 p-3">
              <div className="flex items-center justify-between">
                <Field label="Name" value={proj.name} onChange={(v) => updateList("projects", i, { name: v })} />
                <button type="button" onClick={() => removeItem("projects", i)} className="ml-3 text-accent-rust">
                  Remove
                </button>
              </div>
              <Field
                label="Description"
                textarea
                value={proj.description}
                onChange={(v) => updateList("projects", i, { description: v })}
              />
              <Field
                label="Technologies (comma separated)"
                value={(proj.technologies || []).join(", ")}
                onChange={(v) =>
                  updateList("projects", i, { technologies: v.split(",").map((t) => t.trim()).filter(Boolean) })
                }
              />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Experience"
        addLabel="Add role"
        onAdd={() => addItem("experience", { title: "", company: "", duration: "", description: "", technologies: [] })}
      >
        {profile.experience.length === 0 && <p className="text-sm text-text-muted">No work experience detected.</p>}
        <div className="space-y-4">
          {profile.experience.map((exp, i) => (
            <div key={i} className="space-y-2 rounded-card border border-text-muted/20 p-3">
              <div className="flex items-center justify-between">
                <Field label="Title" value={exp.title} onChange={(v) => updateList("experience", i, { title: v })} />
                <button type="button" onClick={() => removeItem("experience", i)} className="ml-3 text-accent-rust">
                  Remove
                </button>
              </div>
              <Field label="Company" value={exp.company} onChange={(v) => updateList("experience", i, { company: v })} />
              <Field label="Duration" value={exp.duration} onChange={(v) => updateList("experience", i, { duration: v })} />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Education"
        addLabel="Add education"
        onAdd={() => addItem("education", { degree: "", institution: "", field: null, duration: null })}
      >
        {profile.education.length === 0 && <p className="text-sm text-text-muted">No education detected.</p>}
        <div className="space-y-4">
          {profile.education.map((edu, i) => (
            <div key={i} className="space-y-2 rounded-card border border-text-muted/20 p-3">
              <div className="flex items-center justify-between">
                <Field label="Degree" value={edu.degree} onChange={(v) => updateList("education", i, { degree: v })} />
                <button type="button" onClick={() => removeItem("education", i)} className="ml-3 text-accent-rust">
                  Remove
                </button>
              </div>
              <Field
                label="Institution"
                value={edu.institution}
                onChange={(v) => updateList("education", i, { institution: v })}
              />
            </div>
          ))}
        </div>
      </Section>

      {status === "error" && <ErrorState message={error} onRetry={() => setStatus("idle")} />}

      <div className="flex justify-end gap-3 pb-8">
        <button
          type="button"
          onClick={handleConfirm}
          className="rounded-card bg-accent-brass px-6 py-3 font-display font-semibold text-bg-primary hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-brass"
        >
          Confirm & Save Profile
        </button>
      </div>
    </div>
  );
}
