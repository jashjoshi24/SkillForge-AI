import { useCallback, useRef, useState } from "react";

import { api, ApiError } from "../api/client.js";
import { ErrorState, LoadingState } from "../components/StatusStates.jsx";

const ALLOWED_TYPES = [".pdf", ".docx"];
const MAX_SIZE_MB = 8;

export default function ResumeUploadPage({ onExtracted }) {
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | uploading | error
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const validateClientSide = (file) => {
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_TYPES.includes(ext)) {
      return `Unsupported file type "${ext}". Please upload a PDF or DOCX resume.`;
    }
    if (file.size === 0) return "That file is empty.";
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Max size is ${MAX_SIZE_MB} MB.`;
    }
    return null;
  };

  const handleFile = useCallback(
    async (file) => {
      const clientError = validateClientSide(file);
      if (clientError) {
        setError(clientError);
        setStatus("error");
        return;
      }
      setStatus("uploading");
      setError(null);
      try {
        const result = await api.uploadResume(file);
        onExtracted(result, file.name);
      } catch (e) {
        setStatus("error");
        setError(e instanceof ApiError ? e.message : "Upload failed. Please try again.");
      }
    },
    [onExtracted]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  if (status === "uploading") {
    return <LoadingState message="Reading your resume…" />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-2 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-accent-brass">Module B · Survey Intake</p>
        <h1 className="font-display text-3xl font-bold">Upload your resume</h1>
        <p className="text-text-muted">
          We'll extract your skills, projects, experience, and education — you'll review and confirm
          everything before it's saved.
        </p>
      </header>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`rounded-card border-2 border-dashed p-12 text-center transition-colors ${
          dragActive ? "border-accent-brass bg-accent-brass/10" : "border-text-muted/40 bg-bg-surface"
        }`}
      >
        <p className="mb-1 font-display text-lg">Drag & drop your resume here</p>
        <p className="mb-4 text-sm text-text-muted">Supported formats: PDF, DOCX · Max {MAX_SIZE_MB} MB</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-card bg-accent-brass px-6 py-3 font-display font-semibold text-bg-primary hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-brass"
        >
          Choose a file
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          aria-label="Upload resume file"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {status === "error" && (
        <ErrorState
          title="We couldn't process that file"
          message={error}
          onRetry={() => {
            setStatus("idle");
            setError(null);
          }}
        />
      )}
    </div>
  );
}
