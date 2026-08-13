import React from 'react';

export const ProgressMeter = ({ label, value, max = 100, color = "#C89B3C", unit = "%" }) => {
  const percent = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="space-y-1.5 font-mono text-xs">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-[#A9B4C0] uppercase tracking-wider">{label}</span>
        <span className="font-bold text-[#EDEDE3]">{value}{unit}</span>
      </div>

      {/* Blueprint Technical Ruler Gauge */}
      <div className="relative bg-[#10243E] h-5 border border-[#EDEDE3]/20 rounded-sm overflow-hidden p-0.5">
        
        {/* Ruler Tick Marks Background Overlay */}
        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-30">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="w-[1px] h-full bg-[#EDEDE3]" />
          ))}
        </div>

        {/* Filled Gauge Bar */}
        <div 
          className="h-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};
