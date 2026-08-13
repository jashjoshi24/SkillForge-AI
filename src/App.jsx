import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ResumeUpload } from './components/ResumeUpload';
import { RoadmapView } from './components/RoadmapView';
import { Recommendations } from './components/Recommendations';
import { Dashboard } from './components/Dashboard';

const MainContent = () => {
  const { activeTab } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {activeTab === 'landing' && <LandingPage />}
      {activeTab === 'resume' && <ResumeUpload />}
      {activeTab === 'roadmap' && <RoadmapView />}
      {activeTab === 'recommendations' && <Recommendations />}
      {activeTab === 'dashboard' && <Dashboard />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#10243E] text-[#EDEDE3] font-body bg-blueprint-grid">
        <Navbar />
        <MainContent />
        
        {/* Footer */}
        <footer className="border-t border-[#EDEDE3]/10 py-6 mt-16 font-mono text-[11px] text-[#A9B4C0] text-center">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              SKILLFORGE AI · HACK ORBIT 2026 · TRACK 1 (AI & HUMAN AUGMENTATION) · PS-01
            </div>
            <div className="text-[#C89B3C]">
              DESIGN SYSTEM: SKILL CARTOGRAPHY (BLUEPRINT PALETTE)
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}
