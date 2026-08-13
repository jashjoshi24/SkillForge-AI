/**
 * Sage = achieved/done, Rust = gap/warning, Brass = active/priority.
 * Never color-only: every chip also carries an icon + text label
 * (accessibility requirement, Section 8/13 of the project docs).
 */
const VARIANTS = {
  matched: { icon: "✓", label: "Matched", classes: "border-accent-sage/60 bg-accent-sage/10 text-accent-sage" },
  gap: { icon: "▲", label: "Gap", classes: "border-accent-rust/60 bg-accent-rust/10 text-accent-rust" },
  priority: { icon: "★", label: "Priority", classes: "border-accent-brass/60 bg-accent-brass/10 text-accent-brass" },
  done: { icon: "✓", label: "Done", classes: "border-accent-sage/60 bg-accent-sage/10 text-accent-sage" },
  in_progress: { icon: "◐", label: "In progress", classes: "border-accent-brass/60 bg-accent-brass/10 text-accent-brass" },
  not_started: { icon: "○", label: "Not started", classes: "border-text-muted/40 bg-transparent text-text-muted" },
};

export default function StatusChip({ variant, children }) {
  const v = VARIANTS[variant] || VARIANTS.not_started;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 font-mono text-xs uppercase tracking-wide ${v.classes}`}
    >
      <span aria-hidden="true">{v.icon}</span>
      {children || v.label}
    </span>
  );
}
