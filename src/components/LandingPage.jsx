import React from 'react';
import { useApp } from '../context/AppContext';
import { TerrainMap } from './TerrainMap';
import { Compass, Upload, MapPin, BarChart3, ShieldCheck, ArrowRight, Sparkles, Layers, Target } from 'lucide-react';

export const LandingPage = () => {
  const { setActiveTab, targetRole, setTargetRole, TARGET_ROLES, matchPercentage } = useApp();

  const steps = [
    { num: '01', title: 'Upload Resume', desc: 'Parse PDF/DOCX resume text into structured skill data via AI extraction.' },
    { num: '02', title: 'Analyze Skills', desc: 'Review & correct extracted technical skills, experience, and projects.' },
    { num: '03', title: 'Map Your Gaps', desc: 'Compare your capabilities against role targets with weighted gap scoring.' },
    { num: '04', title: 'Build Your Route', desc: 'Generate multi-phase actionable learning roadmaps with curated resources.' },
    { num: '05', title: 'Track Progress', desc: 'Watch your topographic terrain map elevate in real time as skills complete.' }
  ];

  const features = [
    { icon: Compass, title: 'Topographic Skill Cartography', desc: 'Visual elevation maps where skills form peaks and gaps mark unexplored terrain.' },
    { icon: Target, title: 'Personalized Gap Weighting', desc: 'LLM-driven skill gap priority tailored specifically to modern market standards.' },
    { icon: Layers, title: 'Sequential Waypoint Route', desc: 'Phase-by-phase actionable execution plan from core fundamentals to interview prep.' },
    { icon: BarChart3, title: 'Field Log Analytics', desc: 'Real-time skill acquisition timeline and target role radar chart visualization.' }
  ];

  return (
    <div className="space-y-16 py-6">
      
      {/* HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Hero Left Content */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16324F] border border-[#C89B3C]/40 text-[#C89B3C] font-mono text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HACK ORBIT 2026 · TRACK 1 (AI & HUMAN AUGMENTATION)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-[#EDEDE3] leading-tight">
            Map the terrain between where you are and the role you want.
          </h1>

          <p className="text-[#A9B4C0] text-base sm:text-lg leading-relaxed font-body">
            Your career is terrain, and <strong className="text-[#EDEDE3]">SkillForge AI</strong> is your surveying instrument. 
            Transform unstructured resume text into a dynamic topographic skill map, plot actionable learning routes, and navigate to target roles with mathematical precision.
          </p>

          {/* Target Role Selector Card */}
          <div className="p-3 rounded bg-[#16324F] border border-[#EDEDE3]/15 font-mono text-xs space-y-2">
            <div className="text-[#A9B4C0] text-[11px] uppercase tracking-wider flex items-center justify-between">
              <span>SELECT TARGET ROLE TO SURVEY:</span>
              <span className="text-[#6B9080] font-bold">MATCH CAPACITY: {matchPercentage}%</span>
            </div>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-[#10243E] text-[#EDEDE3] font-bold p-2.5 rounded border border-[#C89B3C]/50 focus:outline-none"
            >
              {TARGET_ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Primary Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('resume')}
              className="w-full sm:w-auto px-6 py-3 rounded bg-[#C89B3C] hover:bg-[#b08732] text-[#10243E] font-display font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Upload className="w-4 h-4" />
              UPLOAD YOUR RESUME
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className="w-full sm:w-auto px-6 py-3 rounded bg-[#16324F] hover:bg-[#1f4368] text-[#EDEDE3] font-mono text-xs tracking-wider border border-[#EDEDE3]/20 flex items-center justify-center gap-2 transition-all"
            >
              <Compass className="w-4 h-4 text-[#C89B3C]" />
              EXPLORE DEMO ROUTE
            </button>
          </div>
        </div>

        {/* Hero Right — Interactive Miniature Skill Terrain Map */}
        <div className="lg:col-span-6">
          <div className="bg-[#16324F] p-2 rounded-md border border-[#EDEDE3]/20 shadow-2xl relative">
            <div className="text-xs font-mono text-[#A9B4C0] px-3 py-1.5 flex items-center justify-between border-b border-[#EDEDE3]/10 mb-2">
              <span className="flex items-center gap-1.5 text-[#C89B3C]">
                <MapPin className="w-3.5 h-3.5" />
                LIVE TOPOGRAPHIC PREVIEW
              </span>
              <span>ROLE: {targetRole.toUpperCase()}</span>
            </div>

            {/* Embedded Terrain Map Component */}
            <TerrainMap isMini={true} />

            <div className="mt-2 text-[10px] font-mono text-[#A9B4C0] text-center italic">
              * Contours represent skill depth & elevation. As roadmap items complete, terrain grows.
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — 5 STEP SURVEY METHODOLOGY */}
      <section className="space-y-8 pt-6 border-t border-[#EDEDE3]/10">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono text-[#C89B3C] tracking-widest uppercase">METHODOLOGY</div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#EDEDE3]">
            How Skill Cartography Works
          </h2>
          <p className="text-xs font-mono text-[#A9B4C0] max-w-xl mx-auto">
            From unstructured PDF documents to actionable waypoint navigation in five systematic steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step) => (
            <div key={step.num} className="bg-[#16324F] p-4 rounded border border-[#EDEDE3]/12 space-y-3 hover:border-[#C89B3C]/50 transition-colors">
              <div className="text-2xl font-mono font-bold text-[#C89B3C] border-b border-[#EDEDE3]/10 pb-2">
                {step.num}
              </div>
              <h3 className="font-display font-bold text-sm text-[#EDEDE3]">{step.title}</h3>
              <p className="text-xs font-body text-[#A9B4C0] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS GRID */}
      <section className="space-y-6 pt-6 border-t border-[#EDEDE3]/10">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono text-[#6B9080] tracking-widest uppercase">PRECISION INSTRUMENTS</div>
          <h2 className="text-2xl font-bold font-display text-[#EDEDE3]">Built for Career Surveying</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="bg-[#16324F] p-5 rounded border border-[#EDEDE3]/12 space-y-3">
                <div className="w-8 h-8 rounded bg-[#10243E] border border-[#C89B3C]/50 flex items-center justify-center text-[#C89B3C]">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-sm text-[#EDEDE3]">{f.title}</h3>
                <p className="text-xs font-body text-[#A9B4C0] leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER CTA BAR */}
      <div className="p-6 rounded bg-[#16324F] border border-[#C89B3C]/40 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div>
          <div className="font-bold text-[#EDEDE3]">READY TO SURVEY YOUR SKILL TERRAIN?</div>
          <div className="text-[#A9B4C0] text-[11px]">Deploy Demo Mode immediately or connect live FastAPI backend endpoints.</div>
        </div>
        <button
          onClick={() => setActiveTab('resume')}
          className="px-5 py-2.5 rounded bg-[#C89B3C] hover:bg-[#b08732] text-[#10243E] font-bold text-xs tracking-wider flex items-center gap-2 shadow"
        >
          START SURVEY NOW
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
