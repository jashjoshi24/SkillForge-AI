git switch mainimport React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, ShieldCheck, Printer, X, Sparkles, Award, MapPin } from 'lucide-react';

export const SurveyCertificateModal = ({ isOpen, onClose }) => {
  const { targetRole, matchPercentage, user, extractedProfile, roadmap } = useApp();

  if (!isOpen) return null;

  const completedCount = roadmap.reduce((acc, p) => acc + p.items.filter(i => i.completed).length, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#10243E]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#16324F] border-2 border-[#C89B3C] rounded-md max-w-2xl w-full p-6 space-y-6 shadow-2xl relative font-mono text-xs text-[#EDEDE3] bg-blueprint-grid">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A9B4C0] hover:text-[#EDEDE3] p-1 rounded border border-[#EDEDE3]/15"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Blueprint Certificate Header */}
        <div className="border-b border-[#EDEDE3]/20 pb-4 text-center space-y-1">
          <div className="inline-flex items-center gap-2 text-[#C89B3C] font-bold text-xs uppercase tracking-widest">
            <Compass className="w-4 h-4" />
            <span>OFFICIAL CAREER CARTOGRAPHY SURVEY REPORT</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-[#EDEDE3] tracking-wider">
            SKILLFORGE AI · TECHNICAL TELEMETRY
          </h2>
          <div className="text-[10px] text-[#A9B4C0]">
            SURVEY CODE: SKF-2026-ORBIT · ISSUED FOR {targetRole.toUpperCase()}
          </div>
        </div>

        {/* Certificate Body Details Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded bg-[#10243E] border border-[#EDEDE3]/15">
          <div className="space-y-1">
            <div className="text-[10px] text-[#A9B4C0]">CANDIDATE / ENGINEER:</div>
            <div className="font-bold text-[#EDEDE3] text-sm">{user?.name || 'Charmi Sonagra'}</div>
            <div className="text-[10px] text-[#6B9080]">{user?.email || 'charmi.sonagra@gmail.com'}</div>
          </div>

          <div className="space-y-1 text-right">
            <div className="text-[10px] text-[#A9B4C0]">TARGET DOMAIN:</div>
            <div className="font-bold text-[#C89B3C] text-sm">{targetRole}</div>
            <div className="text-[10px] text-[#A9B4C0]">STATUS: VERIFIED TELEMETRY</div>
          </div>
        </div>

        {/* Metric Telemetry Stamps */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-[#10243E] rounded border border-[#6B9080]/40">
            <div className="text-[10px] text-[#A9B4C0]">MATCH CAPACITY</div>
            <div className="text-2xl font-bold text-[#6B9080]">{matchPercentage}%</div>
          </div>

          <div className="p-3 bg-[#10243E] rounded border border-[#C89B3C]/40">
            <div className="text-[10px] text-[#A9B4C0]">CAPABILITY PEAKS</div>
            <div className="text-2xl font-bold text-[#C89B3C]">{extractedProfile.skills.length + completedCount}</div>
          </div>

          <div className="p-3 bg-[#10243E] rounded border border-[#B5563C]/40">
            <div className="text-[10px] text-[#A9B4C0]">TERRAIN ALTITUDE</div>
            <div className="text-2xl font-bold text-[#B5563C]">{Math.min(98, 45 + completedCount * 12)}m</div>
          </div>
        </div>

        {/* Verification Footer Seals */}
        <div className="flex items-center justify-between pt-2 border-t border-[#EDEDE3]/15 text-[10px] text-[#A9B4C0]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#6B9080]" />
            <span>CRYPTOGRAPHIC VERIFICATION STAMP: HACK-ORBIT-2026</span>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded bg-[#C89B3C] hover:bg-[#b08732] text-[#10243E] font-bold text-xs flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT / SAVE PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
