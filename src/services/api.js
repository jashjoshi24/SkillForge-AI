import { MOCK_DATA_BY_ROLE } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
    formData.append('target_role', targetRole);

    const res = await fetch(`${API_BASE_URL}/extract`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error(`Resume extraction failed with status ${res.status}`);
    const data = await res.json();
    const extractedData = data.data || (data.skills ? { skills: data.skills, experience: data.experience || [], projects: data.projects || [], education: data.education || [] } : null);
    return { success: true, data: extractedData || MOCK_DATA_BY_ROLE[targetRole].extractedProfile };
  } catch (err) {
    console.warn('API connection failed, falling back to mock mode:', err.message);
    const fallback = MOCK_DATA_BY_ROLE[targetRole] || MOCK_DATA_BY_ROLE['Backend Developer'];
    return { success: true, data: fallback.extractedProfile, isFallback: true };
  }
};

export const getGapAnalysis = async (userSkills, targetRole = 'Backend Developer', demoMode = true) => {
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
    const res = await fetch(`${API_BASE_URL}/gap-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills: userSkills, target_role: targetRole })
    });

    if (!res.ok) throw new Error(`Gap analysis failed with status ${res.status}`);
    const data = await res.json();
    return { success: true, ...data };
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

export const generateRoadmap = async (targetRole = 'Backend Developer', demoMode = true) => {
  if (demoMode) {
    await simulateNetworkDelay(1200);
    const mockRole = MOCK_DATA_BY_ROLE[targetRole] || MOCK_DATA_BY_ROLE['Backend Developer'];
    return { success: true, roadmap: mockRole.roadmap };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/roadmap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_role: targetRole })
    });

    if (!res.ok) throw new Error(`Roadmap generation failed with status ${res.status}`);
    const data = await res.json();
    return { success: true, roadmap: data.roadmap };
  } catch (err) {
    const fallback = MOCK_DATA_BY_ROLE[targetRole] || MOCK_DATA_BY_ROLE['Backend Developer'];
    return { success: true, roadmap: fallback.roadmap, isFallback: true };
  }
};

export const getRecommendations = async (targetRole = 'Backend Developer', demoMode = true) => {
  if (demoMode) {
    await simulateNetworkDelay(500);
    const mockRole = MOCK_DATA_BY_ROLE[targetRole] || MOCK_DATA_BY_ROLE['Backend Developer'];
    return { success: true, recommendations: mockRole.recommendations };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/recommendations?target_role=${encodeURIComponent(targetRole)}`);
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

    if (!res.ok) throw new Error(`Login failed with status ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      success: true,
      user: { email, name: email.split('@')[0] || 'Demo User', id: 'usr-101' },
      token: 'mock-fallback-token',
      isFallback: true
    };
  }
};
