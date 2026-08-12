/**
 * Thin fetch wrapper for the SkillForge AI backend. Every LLM call and every
 * database write happens behind these endpoints — the frontend never talks
 * to the AI provider or the database directly, and no API key ever lives
 * in this codebase (per project docs Section 4/6).
 */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const DEV_USER_EMAIL = import.meta.env.VITE_DEV_USER_EMAIL || "";

export class ApiError extends Error {
  constructor(status, code, message, detail) {
    super(message);
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (DEV_USER_EMAIL) headers["X-Dev-User-Email"] = DEV_USER_EMAIL;
  if (options.json !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.json);
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Couldn't reach the SkillForge server. Check your connection and try again.");
  }

  if (response.status === 204) return null;

  let body = null;
  try {
    body = await response.json();
  } catch {
    // non-JSON response
  }

  if (!response.ok) {
    const err = body?.error || {};
    throw new ApiError(
      response.status,
      err.code || "UNKNOWN_ERROR",
      err.message || "Something went wrong. Please try again.",
      err.detail
    );
  }
  return body;
}

export const api = {
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request("/extract/upload", { method: "POST", body: formData });
  },
  confirmProfile: (profile, sourceFilename) =>
    request("/extract/confirm", { method: "POST", json: { profile, source_filename: sourceFilename } }),
  getProfile: () => request("/extract/profile"),
  getGapAnalysis: (targetRole) =>
    request(`/gap-analysis?target_role=${encodeURIComponent(targetRole)}`),
  generateRoadmap: (targetRole, currentLevel) =>
    request("/roadmap/generate", {
      method: "POST",
      json: { target_role: targetRole, current_level: currentLevel },
    }),
  getRoadmap: () => request("/roadmap"),
};

export const TARGET_ROLES = [
  { value: "backend_developer", label: "Backend Developer" },
  { value: "frontend_developer", label: "Frontend Developer" },
  { value: "data_analyst", label: "Data Analyst" },
  { value: "ml_engineer", label: "ML Engineer" },
  { value: "devops", label: "DevOps Engineer" },
  { value: "cybersecurity", label: "Cybersecurity Analyst" },
];
