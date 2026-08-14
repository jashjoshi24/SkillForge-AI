import { MOCK_DATA_BY_ROLE } from './mockData';
import { adaptExtractedProfile, adaptGapAnalysis, adaptRoadmapResponse } from './adapters';

// Real backend contract lives in backend/app/routers/*.py (see also the
// original reference client at frontend/src/api/client.js). Endpoint paths
// below were previously wrong (/extract, /gap-analysis POST, /roadmap POST,
// /auth/login-only) and have been corrected to match app/main.py's actual
// routes: /auth/*, /extract/upload+confirm+profile, /gap-analysis (GET),
// /roadmap/generate + /roadmap (GET).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// The mock data set (services/mockData.js TARGET_ROLES) keys off friendly
// labels ("Backend Developer", ... "Cybersecurity Specialist"); the real
// API's TargetRole enum uses snake_case values and labels its 6th role
// "Cybersecurity Analyst" — both spellings are mapped here so whichever
// label the UI is actually using still resolves correctly.
const ROLE_LABEL_TO_VALUE = {
  'Backend Developer': 'backend_developer',
  'Frontend Developer': 'frontend_developer',
  'Data Analyst': 'data_analyst',
  'ML Engineer': 'ml_engineer',
  'DevOps Engineer': 'devops',
  'Cybersecurity Specialist': 'cybersecurity',
  'Cybersecurity Analyst': 'cybersecurity',
};

const toRoleValue = (targetRole) => ROLE_LABEL_TO_VALUE[targetRole] || targetRole;

// --- Auth token storage ------------------------------------------------
// Real app (not a Claude artifact), so localStorage is the normal choice;
// fall back to an in-memory value if storage is unavailable (e.g. private
// browsing modes that throw on access).
let inMemoryToken = null;
const TOKEN_KEY = 'skillforge_token';

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || inMemoryToken;
  } catch {
    return inMemoryToken;
  }
};

const setToken = (token) => {
  inMemoryToken = token;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage unavailable — in-memory value above still works for this session
  }
};

export const clearToken = () => setToken(null);

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper to delay mock calls to feel realistic
const simulateNetworkDelay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

export const extractResume = async (file, demoMode = true, targetRole = 'Backend Developer') => {
  if (demoMode) {
    await simulateNetworkDelay(1800);
    const mockRole = MOCK_DATA_BY_ROLE[targetRole] || MOCK_DATA_BY_ROLE['Backend Developer'];
    return {
      success: true,
      data: mockRole.extractedProfile
    };
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/extract/upload`, {
      method: 'POST',
      headers: { ...authHeaders() },
      body: formData
    });

    if (!res.ok) throw new Error(`Resume extraction failed with status ${res.status}`);
    const data = await res.json();
    // ExtractionResponse: { profile: { skills, projects, experience, education }, source_filename, warnings }
    return {
      success: true,
      data: adaptExtractedProfile(data.profile),
      sourceFilename: data.source_filename,
      warnings: data.warnings,
    };
  } catch (err) {
    console.warn('API connection failed, falling back to mock mode:', err.message);
    const fallback = MOCK_DATA_BY_ROLE[targetRole] || MOCK_DATA_BY_ROLE['Backend Developer'];
    return { success: true, data: fallback.extractedProfile, isFallback: true };
  }
};

// Persists the (possibly user-edited) extracted profile as the real skill
// profile. Call this after extractResume() + any review-screen edits.
export const confirmProfile = async (profile, sourceFilename, demoMode = true) => {
  if (demoMode) {
    await simulateNetworkDelay(400);
    return { success: true, profile };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/extract/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ profile, source_filename: sourceFilename })
    });
    if (!res.ok) throw new Error(`Profile confirmation failed with status ${res.status}`);
    const data = await res.json();
    return { success: true, profile: data };
  } catch (err) {
    console.warn('API confirmProfile error:', err.message);
    return { success: false, error: err.message };
  }
};

export const getGapAnalysis = async (targetRole = 'Backend Developer', demoMode = true) => {
  if (demoMode) {
    await simulateNetworkDelay(800);
    const mockRole = MOCK_DATA_BY_ROLE[targetRole] || MOCK_DATA_BY_ROLE['Backend Developer'];
    return {
      success: true,
      matchPercentage: mockRole.user.matchPercentage,
      skillGaps: mockRole.skillGaps,
      achievedSkills: mockRole.extractedProfile.skills
    };
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/gap-analysis?target_role=${encodeURIComponent(toRoleValue(targetRole))}`,
      { headers: { ...authHeaders() } }
    );

    if (!res.ok) throw new Error(`Gap analysis failed with status ${res.status}`);
    const data = await res.json();
    const adapted = adaptGapAnalysis(data);
    return {
      success: true,
      matchPercentage: adapted.matchPercentage,
      skillGaps: adapted.skillGaps,
      achievedSkills: data.matched_skills
    };
  } catch (err) {
    console.warn('API gap analysis error:', err.message);
    const fallback = MOCK_DATA_BY_ROLE[targetRole] || MOCK_DATA_BY_ROLE['Backend Developer'];
    return {
      success: true,
      matchPercentage: fallback.user.matchPercentage,
      skillGaps: fallback.skillGaps,
      achievedSkills: fallback.extractedProfile.skills,
      isFallback: true
    };
  }
};

export const generateRoadmap = async (targetRole = 'Backend Developer', demoMode = true, currentLevel = undefined) => {
  if (demoMode) {
    await simulateNetworkDelay(1200);
    const mockRole = MOCK_DATA_BY_ROLE[targetRole] || MOCK_DATA_BY_ROLE['Backend Developer'];
    return { success: true, roadmap: mockRole.roadmap };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/roadmap/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ target_role: toRoleValue(targetRole), current_level: currentLevel })
    });

    if (!res.ok) throw new Error(`Roadmap generation failed with status ${res.status}`);
    const data = await res.json();
    return { success: true, roadmap: adaptRoadmapResponse(data) };
  } catch (err) {
    console.warn('API roadmap generation error:', err.message);
    const fallback = MOCK_DATA_BY_ROLE[targetRole] || MOCK_DATA_BY_ROLE['Backend Developer'];
    return { success: true, roadmap: fallback.roadmap, isFallback: true };
  }
};

export const getRoadmap = async (demoMode = true, targetRole = 'Backend Developer') => {
  if (demoMode) {
    await simulateNetworkDelay(400);
    const mockRole = MOCK_DATA_BY_ROLE[targetRole] || MOCK_DATA_BY_ROLE['Backend Developer'];
    return { success: true, roadmap: mockRole.roadmap };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/roadmap`, { headers: { ...authHeaders() } });
    if (!res.ok) throw new Error(`Fetching roadmap failed with status ${res.status}`);
    const data = await res.json();
    return { success: true, roadmap: adaptRoadmapResponse(data) };
  } catch (err) {
    console.warn('API getRoadmap error:', err.message);
    const fallback = MOCK_DATA_BY_ROLE[targetRole] || MOCK_DATA_BY_ROLE['Backend Developer'];
    return { success: true, roadmap: fallback.roadmap, isFallback: true };
  }
};

// NOTE: Module E (Recommendations) has not been ported into backend/app/
// yet — this endpoint doesn't exist on the real backend today, so
// non-demo calls will fail and fall through to the mock data below until
// that module is ported. Left wired up so it "just works" once it is.
export const getRecommendations = async (targetRole = 'Backend Developer', demoMode = true) => {
  if (demoMode) {
    await simulateNetworkDelay(500);
    const mockRole = MOCK_DATA_BY_ROLE[targetRole] || MOCK_DATA_BY_ROLE['Backend Developer'];
    return { success: true, recommendations: mockRole.recommendations };
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/recommendations?target_role=${encodeURIComponent(toRoleValue(targetRole))}`,
      { headers: { ...authHeaders() } }
    );
    if (!res.ok) throw new Error(`Failed to load recommendations: ${res.status}`);
    const data = await res.json();
    return { success: true, recommendations: data.recommendations };
  } catch (err) {
    const fallback = MOCK_DATA_BY_ROLE[targetRole] || MOCK_DATA_BY_ROLE['Backend Developer'];
    return { success: true, recommendations: fallback.recommendations, isFallback: true };
  }
};

export const loginUser = async (email, password, demoMode = true) => {
  if (demoMode) {
    await simulateNetworkDelay(400);
    return {
      success: true,
      user: { email, name: email.split('@')[0] || 'Member User', id: 'usr-101' },
      token: 'mock-jwt-token-orbit-2026'
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error?.message || `Login failed with status ${res.status}`);
    }
    const data = await res.json();
    // TokenResponse: { access_token, token_type, user }
    setToken(data.access_token);
    return { success: true, user: data.user, token: data.access_token };
  } catch (err) {
    // Unlike extractResume/getGapAnalysis/etc., a real login attempt must
    // NOT silently fall back to a fake "successful" account — a wrong
    // password or unreachable server has to surface as a real error,
    // otherwise the user would appear logged in under a fake identity.
    console.warn('API login error:', err.message);
    return { success: false, error: err.message };
  }
};

export const signupUser = async (email, password, name, demoMode = true) => {
  if (demoMode) {
    await simulateNetworkDelay(400);
    return {
      success: true,
      user: { email, name: name || email.split('@')[0] || 'Member User', id: 'usr-101' },
      token: 'mock-jwt-token-orbit-2026'
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error?.message || `Signup failed with status ${res.status}`);
    }
    const data = await res.json();
    setToken(data.access_token);
    return { success: true, user: data.user, token: data.access_token };
  } catch (err) {
    console.warn('API signup error:', err.message);
    return { success: false, error: err.message };
  }
};

export const logoutUser = () => {
  clearToken();
  return { success: true };
};

// Fetches the real account behind whatever token is currently stored (see
// getToken() above) — used to restore a session on page load and to show
// the real logged-in name/email instead of the AUTH_DEV_MODE placeholder
// account. Not demo-gated: there's no meaningful "mock" version of
// re-checking who's logged in.
export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) return { success: false, error: 'Not logged in.' };

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, { headers: { ...authHeaders() } });
    if (!res.ok) throw new Error(`Failed to load account with status ${res.status}`);
    const data = await res.json();
    return { success: true, user: data };
  } catch (err) {
    console.warn('API getCurrentUser error:', err.message);
    return { success: false, error: err.message };
  }
};
