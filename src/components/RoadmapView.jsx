import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SkillGap } from './SkillGap';
import { MapPin, CheckSquare, Square, ChevronDown, ChevronUp, ExternalLink, Clock, Sparkles, Layers } from 'lucide-react';

export const RoadmapView = () => {
  const { roadmap, toggleRoadmapItem, targetRole } = useApp();
  const [expandedPhases, setExpandedPhases] = useState({
    'phase-1': true,
    'fphase-1': true,
    'dphase-1': true,
    'mphase-1': true,
    'dophase-1': true,
    'cphase-1': true,
    'phase-2': true,
    'fphase-2': true
  });

  const togglePhaseExpand = (phaseId) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const totalItems = roadmap.reduce((acc, p) => acc + p.items.length, 0);
  const completedItems = roadmap.reduce((acc, p) => acc + p.items.filter(i => i.completed).length, 0);
  const overallProgress = Math.round((completedItems / totalItems) * 100) || 0;

  return (
    <div className="space-y-8 font-mono text-xs">
      
      {/* Embedded Skill Gap Capability Summary */}
      <SkillGap />

      {/* BLUEPRINT ROADMAP ROUTE HEADER */}
      <div className="bg-[#16324F] p-5 rounded border border-[#C89B3C]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#C89B3C] font-bold text-sm">
            <MapPin className="w-4 h-4" />
            <span>BLUEPRINT WAYPOINT ROUTE: {targetRole.toUpperCase()}</span>
          </div>
          <p className="text-[#A9B4C0] text-xs font-body mt-1">
            Sequential multi-phase career path mapped to your exact skill gap analysis. Toggling items expands topographic terrain.
          </p>
        </div>

        <div className="bg-[#10243E] px-4 py-2 rounded border border-[#EDEDE3]/15 text-right shrink-0">
          <div className="text-[10px] text-[#A9B4C0]">ROUTE PROGRESS</div>
          <div className="text-xl font-bold font-mono text-[#C89B3C]">
            {completedItems} / {totalItems} ({overallProgress}%)
          </div>
        </div>
      </div>

      {/* BLUEPRINT GRID WAYPOINT PHASES LIST */}
      <div className="space-y-6 bg-blueprint-grid p-4 rounded-md border border-[#EDEDE3]/15">
        {roadmap.map((phase) => {
          const isExpanded = expandedPhases[phase.id] !== false;
          const isPhaseCompleted = phase.completionPercent === 100;

          return (
            <div 
              key={phase.id} 
              className={`bg-[#16324F] rounded-md border transition-all ${
                isPhaseCompleted 
                  ? 'border-[#6B9080]' 
                  : 'border-[#EDEDE3]/20 hover:border-[#C89B3C]/50'
              }`}
            >
              {/* Phase Waypoint Header Bar */}
              <div 
                onClick={() => togglePhaseExpand(phase.id)}
                className="p-4 flex items-center justify-between cursor-pointer select-none border-b border-[#EDEDE3]/10"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-xs border ${
                    isPhaseCompleted 
                      ? 'bg-[#6B9080]/20 text-[#6B9080] border-[#6B9080]' 
                      : 'bg-[#10243E] text-[#C89B3C] border-[#C89B3C]'
                  }`}>
                    {phase.phaseNumber}
                  </div>
                  <div>
                    <div className="font-bold text-[#EDEDE3] font-display text-sm flex items-center gap-2">
                      <span>PHASE {phase.phaseNumber} · {phase.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono ${
                        isPhaseCompleted 
                          ? 'bg-[#6B9080]/20 text-[#6B9080] border border-[#6B9080]' 
                          : 'bg-[#C89B3C]/20 text-[#C89B3C] border border-[#C89B3C]'
                      }`}>
                        {phase.status.toUpperCase()} ({phase.completionPercent}%)
                      </span>
                    </div>
                    <p className="text-xs font-body text-[#A9B4C0] mt-0.5">{phase.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-24 bg-[#10243E] h-2 rounded-full overflow-hidden border border-[#EDEDE3]/10 hidden sm:block">
                    <div 
                      className={`h-full ${isPhaseCompleted ? 'bg-[#6B9080]' : 'bg-[#C89B3C]'}`} 
                      style={{ width: `${phase.completionPercent}%` }} 
                    />
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-[#A9B4C0]" /> : <ChevronDown className="w-5 h-5 text-[#A9B4C0]" />}
                </div>
              </div>

              {/* Phase Actionable Topics List */}
              {isExpanded && (
                <div className="p-4 space-y-3 bg-[#10243E]/50">
                  {phase.items.map((item) => (
                    <div 
                      key={item.id}
                      className={`p-3 rounded border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        item.completed 
                          ? 'bg-[#16324F]/70 border-[#6B9080]/40 text-[#A9B4C0]' 
                          : 'bg-[#10243E] border-[#EDEDE3]/15 text-[#EDEDE3] hover:border-[#C89B3C]/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleRoadmapItem(phase.id, item.id)}
                          className="mt-0.5 p-0.5 text-[#C89B3C] hover:scale-110 transition-transform"
                        >
                          {item.completed ? (
                            <CheckSquare className="w-5 h-5 text-[#6B9080]" />
                          ) : (
                            <Square className="w-5 h-5 text-[#A9B4C0]" />
                          )}
                        </button>

                        <div className="space-y-1">
                          <span className={`font-mono text-xs font-semibold ${item.completed ? 'line-through text-[#6B9080]' : 'text-[#EDEDE3]'}`}>
                            {item.title}
                          </span>
                          <div className="flex items-center gap-3 text-[10px] text-[#A9B4C0]">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#C89B3C]" />
                              EST: {item.effort}
                            </span>
                            <span>DIFFICULTY: <strong className="text-[#EDEDE3]">{item.difficulty}</strong></span>
                          </div>
                        </div>
                      </div>

                      {item.resourceUrl && (
                        <a
                          href={item.resourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded bg-[#16324F] hover:bg-[#C89B3C]/20 border border-[#EDEDE3]/15 text-[#C89B3C] text-[10px] flex items-center gap-1.5 self-start sm:self-center"
                        >
                          <span>RESOURCE</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
