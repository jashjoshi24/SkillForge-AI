/**
 * Shared loading / error / empty states so no screen is ever left blank
 * while an AI call runs (project docs Section 14). Messages are written in
 * the "field log" voice from the design system, never a generic "oops".
 */
export function LoadingState({ message = "Working on it…" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 rounded-card border border-bg-surface bg-bg-surface/60 p-10 text-center"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-brass border-t-transparent" />
      <p className="font-mono text-sm text-text-muted">{message}</p>
    </div>
  );
}

export function ErrorState({ title = "Something went off course", message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-card border border-accent-rust/50 bg-accent-rust/10 p-6"
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="text-accent-rust">
          ▲
        </span>
        <h3 className="font-display text-base font-semibold text-text-primary">{title}</h3>
      </div>
      <p className="text-sm text-text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-card border border-accent-rust/60 px-4 py-2 text-sm font-medium text-text-primary hover:bg-accent-rust/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-brass"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-text-muted/40 p-10 text-center">
      <span aria-hidden="true" className="text-2xl text-text-muted">
        ⛰
      </span>
      <h3 className="font-display text-base font-semibold text-text-primary">{title}</h3>
      {message && <p className="max-w-md text-sm text-text-muted">{message}</p>}
      {action}
    </div>
  );
}
