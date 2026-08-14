import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_DATA_BY_ROLE, TARGET_ROLES } from '../services/mockData';
import {
  extractResume, confirmProfile, getGapAnalysis, generateRoadmap,
  loginUser, signupUser, getCurrentUser, getToken, clearToken,
} from '../services/api';
import { adaptProfileToApi, buildTerrainNodes } from '../services/adapters';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [demoMode, setDemoMode] = useState(true);
  const [targetRole, setTargetRole] = useState('Backend Developer');

  // Load initial data based on selected role
  const roleData = MOCK_DATA_BY_ROLE[targetRole] || MOCK_DATA_BY_ROLE['Backend Developer'];

  const [user, setUser] = useState(roleData.user);
  const [extractedProfile, setExtractedProfile] = useState(roleData.extractedProfile);
  const [skillGaps, setSkillGaps] = useState(roleData.skillGaps);
  const [roadmap, setRoadmap] = useState(roleData.roadmap);
  const [recommendations, setRecommendations] = useState(roleData.recommendations);
  const [terrainNodes, setTerrainNodes] = useState(roleData.terrainNodes);
  const [matchPercentage, setMatchPercentage] = useState(roleData.user.matchPercentage);
  const [activeTab, setActiveTab] = useState('landing'); // 'landing', 'resume', 'review', 'gap', 'roadmap', 'recommendations', 'dashboard'

  // API MODE only (demoMode === false): the filename of the last real
  // extraction, needed when persisting via POST /extract/confirm; whether
  // the confirm -> gap-analysis -> roadmap pipeline is in flight; and the
  // last error from that pipeline, if any (the UI never gets stuck on
  // failure — it just keeps whatever data it had before).
  const [sourceFilename, setSourceFilename] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [apiError, setApiError] = useState(null);

  // --- Real account auth (Module A) ---------------------------------------
  // authUser is the REAL logged-in account (null when nobody's logged in —
  // in that state, extract/gap-analysis/roadmap calls fall back to the
  // backend's AUTH_DEV_MODE stub account, which is why names showed up as
  // a placeholder before any of this existed).
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Restore a session on page load if a token from a previous login is
  // still saved (see services/api.js getToken()/localStorage).
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    (async () => {
      const result = await getCurrentUser();
      if (result.success) {
        setAuthUser(result.user);
      } else {
        clearToken();
      }
    })();
  }, []);

  // Once a real account is logged in, reflect its real name/email in the
  // `user` object components already read (ExtractionReview, Recommendations)
  // — merged in, not replaced, so the mock-only fields (educationLevel,
  // matchPercentage) stay intact for whatever hasn't been wired to a real
  // equivalent yet.
  useEffect(() => {
    if (authUser) {
      setUser((prev) => ({
        ...prev,
        name: authUser.name || authUser.email.split('@')[0],
        email: authUser.email,
      }));
    }
  }, [authUser]);

  const login = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    const result = await loginUser(email, password, false);
    setAuthLoading(false);
    if (result.success) {
      setAuthUser(result.user);
    } else {
      setAuthError(result.error || 'Login failed.');
    }
    return result;
  };

  const signup = async (email, password, name) => {
    setAuthLoading(true);
    setAuthError(null);
    const result = await signupUser(email, password, name, false);
    setAuthLoading(false);
    if (result.success) {
      setAuthUser(result.user);
    } else {
      setAuthError(result.error || 'Signup failed.');
    }
    return result;
  };

  const logout = () => {
    clearToken();
    setAuthUser(null);
  };

  // When target role changes, reload role dataset. In API mode this only
  // resets to that role's demo defaults as a starting point — real data
  // repopulates it via runExtraction()/confirmAndAnalyze() below, same as
  // a first-time visit would.
  useEffect(() => {
    const data = MOCK_DATA_BY_ROLE[targetRole] || MOCK_DATA_BY_ROLE['Backend Developer'];
    setUser(data.user);
    setExtractedProfile(data.extractedProfile);
    setSkillGaps(data.skillGaps);
    setRoadmap(data.roadmap);
    setRecommendations(data.recommendations);
    setTerrainNodes(data.terrainNodes);
    setMatchPercentage(data.user.matchPercentage);
  }, [targetRole]);

  // --- Real API pipeline (used when demoMode === false) ------------------

  // Runs resume extraction. Pass { forceDemo: true } for the "use sample
  // resume" shortcut, since there's no real file on disk to upload even
  // when API MODE is on. extractResume() always resolves with UI-shaped
  // data (see services/api.js + services/adapters.js), whether it came
  // from the mock set, a real extraction, or a fallback after a failed
  // real call — so this never needs to branch on demoMode itself.
  const runExtraction = async (file, opts = {}) => {
    const useDemo = demoMode || opts.forceDemo;
    const result = await extractResume(file, useDemo, targetRole);
    setExtractedProfile(result.data);
    setSourceFilename(result.sourceFilename || (file && file.name) || null);
    return result;
  };

  // Persists the reviewed profile, then runs real gap analysis + roadmap
  // generation against it, updating skillGaps/roadmap/matchPercentage/
  // terrainNodes from the live backend. No-op in demo mode, since that
  // data already comes from the mock set for the selected role.
  const confirmAndAnalyze = async () => {
    if (demoMode) return;

    setIsSyncing(true);
    setApiError(null);
    try {
      await confirmProfile(adaptProfileToApi(extractedProfile), sourceFilename, false);

      const gapResult = await getGapAnalysis(targetRole, false);
      setSkillGaps(gapResult.skillGaps);
      setMatchPercentage(gapResult.matchPercentage);

      const roadmapResult = await generateRoadmap(targetRole, false);
      setRoadmap(roadmapResult.roadmap);

      setTerrainNodes(buildTerrainNodes(extractedProfile.skills, gapResult.skillGaps));
    } catch (err) {
      // extractResume/getGapAnalysis/generateRoadmap already fall back to
      // mock data internally on network failure, so this mainly guards
      // against confirmProfile's { success: false } path — keep whatever
      // was on screen rather than clearing it out.
      console.warn('Live analysis pipeline failed, keeping previous data:', err.message);
      setApiError(err.message || 'Something went wrong syncing with the live API.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle completion of a roadmap item & update terrain + match score + charts dynamically
  const toggleRoadmapItem = (phaseId, itemId) => {
    let itemJustCompleted = false;

    const updatedRoadmap = roadmap.map(phase => {
      if (phase.id === phaseId) {
        const updatedItems = phase.items.map(item => {
          if (item.id === itemId) {
            const nextCompleted = !item.completed;
            if (nextCompleted) itemJustCompleted = true;
            return { ...item, completed: nextCompleted };
          }
          return item;
        });

        const completedCount = updatedItems.filter(i => i.completed).length;
        const totalCount = updatedItems.length;
        const completionPercent = Math.round((completedCount / totalCount) * 100);
        const status = completionPercent === 100 ? 'completed' : (completionPercent > 0 ? 'in-progress' : 'not-started');

        return {
          ...phase,
          items: updatedItems,
          completionPercent,
          status
        };
      }
      return phase;
    });

    setRoadmap(updatedRoadmap);

    if (itemJustCompleted) {
      // Trigger celebrate confetti
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#C89B3C', '#6B9080', '#EDEDE3']
        });
      } catch (e) {}

      // Dynamically boost terrain elevation and increase match percentage
      setMatchPercentage(prev => Math.min(100, prev + 3));

      setTerrainNodes(prevNodes => {
        return prevNodes.map(node => {
          if (node.status === 'gap') {
            return { ...node, elevation: Math.min(95, node.elevation + 18), status: 'achieved' };
          }
          return { ...node, elevation: Math.min(98, node.elevation + 4) };
        });
      });
    }
  };

  // Add / Edit / Delete extracted skill
  const updateExtractedSkill = (skillId, updatedFields) => {
    setExtractedProfile(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === skillId ? { ...s, ...updatedFields } : s)
    }));
  };

  const deleteExtractedSkill = (skillId) => {
    setExtractedProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== skillId)
    }));
  };

  const addExtractedSkill = (newSkill) => {
    setExtractedProfile(prev => ({
      ...prev,
      skills: [...prev.skills, { ...newSkill, id: `s-${Date.now()}` }]
    }));
  };

  return (
    <AppContext.Provider value={{
      demoMode,
      setDemoMode,
      targetRole,
      setTargetRole,
      TARGET_ROLES,
      user,
      setUser,
      extractedProfile,
      setExtractedProfile,
      updateExtractedSkill,
      deleteExtractedSkill,
      addExtractedSkill,
      skillGaps,
      roadmap,
      toggleRoadmapItem,
      recommendations,
      terrainNodes,
      matchPercentage,
      activeTab,
      setActiveTab,
      runExtraction,
      confirmAndAnalyze,
      isSyncing,
      apiError,
      authUser,
      authLoading,
      authError,
      login,
      signup,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
