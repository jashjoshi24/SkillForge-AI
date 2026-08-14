/**
 * Shape adapters between the real backend (backend/app/schemas/*.py) and
 * the UI's existing data shape (see services/mockData.js). Every component
 * (ExtractionReview, SkillGap, RoadmapView, TerrainMap, Dashboard...) was
 * built against the mock shape, so these functions translate real API
 * responses into that same shape — nothing else in the UI has to change
 * to work in "API MODE" instead of "DEMO MODE".
 */

const PROFICIENCY_SCORE = { beginner: 45, intermediate: 70, advanced: 88, expert: 97 };
const PROFICIENCY_LABEL = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced', expert: 'Expert' };
const LABEL_TO_PROFICIENCY = { Beginner: 'beginner', Intermediate: 'intermediate', Advanced: 'advanced', Expert: 'expert' };

let idCounter = 0;
const nextId = (prefix) => `${prefix}-${++idCounter}`;

// Real ExtractedProfile (backend/app/schemas/resume.py) -> UI extractedProfile shape
export const adaptExtractedProfile = (profile) => {
  if (!profile) return { skills: [], experience: [], projects: [], education: [] };
  return {
    skills: (profile.skills || []).map((s) => ({
      id: nextId('s'),
      name: s.name,
      category: s.category || 'General',
      proficiency: PROFICIENCY_LABEL[s.proficiency] || 'Intermediate',
      score: PROFICIENCY_SCORE[s.proficiency] || 70,
    })),
    experience: (profile.experience || []).map((e) => ({
      id: nextId('e'),
      role: e.title || 'Experience',
      company: e.company || '',
      duration: e.duration || '',
      description: e.description || '',
    })),
    projects: (profile.projects || []).map((p) => ({
      id: nextId('p'),
      title: p.name || 'Project',
      tech: (p.technologies || []).join(', '),
      description: p.description || '',
    })),
    education: (profile.education || []).map((ed) => ({
      id: nextId('ed'),
      degree: ed.degree || '',
      institution: ed.institution || '',
      year: ed.duration || ed.field || '',
    })),
  };
};

// Inverse of the above: UI extractedProfile shape -> the real ExtractedProfile
// payload POST /extract/confirm expects, so user edits made on the review
// screen get sent back in the shape the backend needs.
export const adaptProfileToApi = (uiProfile) => ({
  skills: (uiProfile.skills || []).map((s) => ({
    name: s.name,
    category: s.category,
    proficiency: LABEL_TO_PROFICIENCY[s.proficiency] || 'intermediate',
  })),
  projects: (uiProfile.projects || []).map((p) => ({
    name: p.title,
    description: p.description,
    technologies: (p.tech || '').split(',').map((t) => t.trim()).filter(Boolean),
  })),
  experience: (uiProfile.experience || []).map((e) => ({
    title: e.role,
    company: e.company,
    duration: e.duration,
    description: e.description,
  })),
  education: (uiProfile.education || []).map((ed) => ({
    degree: ed.degree,
    institution: ed.institution,
    duration: ed.year,
  })),
});

const IMPORTANCE_TO_PRIORITY = { critical: 'HIGH', important: 'MEDIUM', nice_to_have: 'LOW' };

// Real GapAnalysisResult (backend/app/schemas/gap_analysis.py) -> UI skillGaps + matchPercentage
export const adaptGapAnalysis = (result) => {
  if (!result) return { skillGaps: [], matchPercentage: 0 };
  const source = (result.prioritized_gaps && result.prioritized_gaps.length)
    ? result.prioritized_gaps
    : (result.gap_skills || []);
  const skillGaps = source.map((g) => ({
    id: nextId('g'),
    name: g.skill,
    currentLevel: 'None',
    targetLevel: g.importance === 'critical' ? 'Advanced' : 'Intermediate',
    priority: IMPORTANCE_TO_PRIORITY[g.importance] || 'MEDIUM',
    scoreGap: Math.round(g.priority_score ?? 50),
  }));
  return { skillGaps, matchPercentage: Math.round(result.match_percentage || 0) };
};

const PHASE_DESCRIPTIONS = {
  'Foundations': 'Core building blocks and fundamentals for this role.',
  'Core Skills': 'The primary technical skills needed for day-to-day work.',
  'Projects': 'Hands-on projects to build a portfolio demonstrating these skills.',
  'Interview Preparation': 'Practice questions and mock scenarios for technical interviews.',
};

// Real RoadmapResponse (backend/app/schemas/roadmap.py) -> UI roadmap
// (an array of phase objects with aggregated completion stats). The real
// API already groups items by phase, so this is mostly a field-rename +
// completion-percentage rollup — no manual grouping needed.
// NOTE: the real RoadmapItemSchema has no `difficulty` or item `id` field
// yet, so those are defaulted/generated here; toggling a roadmap item in
// API mode is therefore visual-only (not persisted) until Module F
// (Progress) is ported to the backend.
export const adaptRoadmapResponse = (response) => {
  const phases = (response && response.phases) || [];
  return phases.map((phase, index) => {
    const items = (phase.items || []).map((item, itemIndex) => ({
      id: nextId(`rm-${index}-${itemIndex}`),
      title: item.title,
      completed: item.status === 'done',
      resourceUrl: (item.resources && item.resources[0] && item.resources[0].url) || null,
      effort: item.estimated_time || '—',
      difficulty: 'Intermediate',
    }));
    const completedCount = items.filter((i) => i.completed).length;
    const completionPercent = items.length ? Math.round((completedCount / items.length) * 100) : 0;
    return {
      id: `phase-${phase.phase}`.toLowerCase().replace(/\s+/g, '-'),
      phaseNumber: String(index + 1).padStart(2, '0'),
      title: (phase.phase || '').toUpperCase(),
      description: PHASE_DESCRIPTIONS[phase.phase] || '',
      status: completionPercent === 100 ? 'completed' : completionPercent > 0 ? 'in-progress' : 'not-started',
      completionPercent,
      items,
    };
  });
};

// The real API has no concept of the topographic map's x/y coordinates —
// that's a purely visual/gamified feature invented for this UI. Generate
// stable pseudo-random placement from achieved skills + gaps so the map
// still renders meaningfully in API mode.
const hashToUnit = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
};

export const buildTerrainNodes = (achievedSkills = [], skillGaps = []) => {
  const nodes = [];
  achievedSkills.slice(0, 6).forEach((s) => {
    nodes.push({
      id: nextId('tn-a'),
      name: s.name,
      x: Math.round(15 + hashToUnit(`${s.name}-x`) * 70),
      y: Math.round(15 + hashToUnit(`${s.name}-y`) * 60),
      elevation: s.score || 70,
      status: 'achieved',
      category: s.category || 'Core',
    });
  });
  skillGaps.slice(0, 6).forEach((g) => {
    nodes.push({
      id: nextId('tn-g'),
      name: g.name,
      x: Math.round(15 + hashToUnit(`${g.name}-x`) * 70),
      y: Math.round(15 + hashToUnit(`${g.name}-y`) * 60),
      elevation: Math.max(10, 100 - (g.scoreGap || 50)),
      status: 'gap',
      category: g.priority === 'HIGH' ? 'Critical Gap' : 'Gap',
    });
  });
  return nodes;
};
