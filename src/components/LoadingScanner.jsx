import React, { useState, useEffect } from 'react';
import { Compass, Scan, Cpu, CheckCircle2 } from 'lucide-react';

export const LoadingScanner = ({ title = "PARSING RESUME & EXTRACTION", onComplete }) => {
  const steps = [
    "SCANNING FILE STRUCTURE & FORMAT...",
    "PARSING RESUME TEXT & SYNTAX...",
    "EXTRACTING TECHNICAL SKILLS...",
    "MAPPING EXPERIENCE & PROJECTS...",
    "BUILDING PROFILE & CALCULATING GAPS..."
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) setTimeout(onComplete, 400);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div className="bg-[#16324F] border border-[#C89B3C] p-8 rounded-md max-w-xl mx-auto shadow-2xl relative overflow-hidden font-mono text-xs">
      
      {/* Animated Scanline Overlay */}
      <div className="animate-scanline" />

      <div className="flex items-center justify-between border-b border-[#EDEDE3]/15 pb-4 mb-6">
        <div className="flex items-center gap-3 text-[#C89B3C]">
          <Scan className="w-6 h-6 animate-pulse" />
          <span className="font-bold tracking-wider text-sm">{title}</span>
        </div>
        <div className="text-[#6B9080] font-bold text-sm">
          {progressPercent}%
        </div>
      </div>

      {/* Progress Meter Bar */}
      <div className="w-full bg-[#10243E] h-2.5 rounded-full overflow-hidden border border-[#EDEDE3]/10 mb-6">
        <div 
          className="bg-gradient-to-r from-[#C89B3C] to-[#6B9080] h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Checklist HUD */}
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div 
              key={idx} 
              className={`flex items-center gap-3 p-2 rounded transition-colors ${
                isCurrent 
                  ? 'bg-[#10243E] text-[#C89B3C] border border-[#C89B3C]/50' 
                  : isDone 
                  ? 'text-[#6B9080]' 
                  : 'text-[#A9B4C0]/40'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-[#6B9080]" />
              ) : isCurrent ? (
                <Cpu className="w-4 h-4 text-[#C89B3C] animate-spin" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-[#A9B4C0]/30" />
              )}
              <span className="font-mono text-[11px] tracking-wider">{step}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-[#EDEDE3]/10 flex items-center justify-between text-[10px] text-[#A9B4C0]">
        <span>SURVEY INSTRUMENT: LLM STRUCTURED PARSER</span>
        <span>STATUS: RUNNING</span>
      </div>
    </div>
  );
};
