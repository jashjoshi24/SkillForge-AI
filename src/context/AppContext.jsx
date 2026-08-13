import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_DATA_BY_ROLE, TARGET_ROLES } from '../services/mockData';
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

  // When target role changes, reload role dataset
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
      setActiveTab
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
