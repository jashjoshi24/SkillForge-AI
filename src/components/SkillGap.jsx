import React from 'react';
import { useApp } from '../context/AppContext';
import { Target, CheckCircle2, AlertTriangle, ShieldAlert, Award, ArrowUpRight } from 'lucide-react';

export const SkillGap = () => {
  const { targetRole, matchPercentage, extractedProfile, skillGaps } = useApp();

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* Role Match Header Card */}
      <div className="bg-[#16324F] p-5 rounded border border-[#C89B3C]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="text-[10px] text-[#A9B4C0] uppercase tracking-widest flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#C89B3C]" />
            SURVEY TARGET ROLE: <strong className="text-[#EDEDE3]">{targetRole.toUpperCase()}</strong>
          </div>
          <h2 className="text-xl font-bold font-display text-[#EDEDE3]">
            Skill Gap & Capability Survey
          </h2>
        </div>

        {/* IBM Plex Mono Match Percentage Metric */}
        <div className="bg-[#10243E] px-5 py-3 rounded border border-[#6B9080]/50 text-center shrink-0">
          <div className="text-[10px] text-[#A9B4C0] uppercase tracking-wider">TARGET MATCH RATE</div>
          <div className="text-3xl font-bold font-mono text-[#6B9080] tracking-tight">
            {matchPercentage}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACHIEVED SKILLS (Contour Sage #6B9080) */}
        <div className="lg:col-span-6 bg-[#16324F] p-5 rounded border border-[#EDEDE3]/15 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EDEDE3]/10 pb-3">
            <div className="flex items-center gap-2 text-[#6B9080] font-bold text-sm font-display">
              <CheckCircle2 className="w-4 h-4" />
              <span>ACHIEVED CAPABILITIES ({extractedProfile.skills.length})</span>
            </div>
            <span className="text-[10px] text-[#A9B4C0]">STATUS: VERIFIED</span>
          </div>

          <div className="space-y-2">
            {extractedProfile.skills.map((skill) => (
              <div key={skill.id} className="p-3 bg-[#10243E] rounded border border-[#6B9080]/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#EDEDE3]">{skill.name}</div>
                  <div className="text-[10px] text-[#A9B4C0]">{skill.category}</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#6B9080]/20 text-[#6B9080] border border-[#6B9080] font-bold">
                    {skill.proficiency.toUpperCase()}
                  </span>
                  <div className="text-[10px] text-[#A9B4C0] mt-0.5">MASTERY {skill.score}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: SKILL GAPS (Rust Flag #B5563C) */}
        <div className="lg:col-span-6 bg-[#16324F] p-5 rounded border border-[#EDEDE3]/15 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EDEDE3]/10 pb-3">
            <div className="flex items-center gap-2 text-[#B5563C] font-bold text-sm font-display">
              <AlertTriangle className="w-4 h-4" />
              <span>UNCHARTED SKILL GAPS ({skillGaps.length})</span>
            </div>
            <span className="text-[10px] text-[#B5563C] font-bold">ROUTE REQUIRED</span>
          </div>

          <div className="space-y-3">
            {skillGaps.map((gap) => (
              <div key={gap.id} className="p-3.5 bg-[#10243E] rounded border border-[#B5563C]/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#EDEDE3] text-xs">{gap.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    gap.priority === 'HIGH' 
                      ? 'bg-[#B5563C]/30 text-[#B5563C] border border-[#B5563C]' 
                      : 'bg-[#C89B3C]/20 text-[#C89B3C] border border-[#C89B3C]'
                  }`}>
                    PRIORITY: {gap.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#A9B4C0] pt-1 border-t border-[#EDEDE3]/10">
                  <span>CURRENT: <strong className="text-[#EDEDE3]">{gap.currentLevel}</strong></span>
                  <span>→</span>
                  <span>TARGET: <strong className="text-[#6B9080]">{gap.targetLevel}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
