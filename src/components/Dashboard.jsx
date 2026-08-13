import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProgressMeter } from './ProgressMeter';
import { TerrainMap } from './TerrainMap';
import { SurveyCertificateModal } from './SurveyCertificateModal';
import { BarChart3, TrendingUp, Compass, Award, CheckCircle2, Layers, Calendar, Activity, DollarSign, FileText, Sparkles, Clock } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend
);

export const Dashboard = () => {
  const { targetRole, matchPercentage, roadmap, extractedProfile, skillGaps } = useApp();
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const totalItems = roadmap.reduce((acc, p) => acc + p.items.length, 0);
  const completedItems = roadmap.reduce((acc, p) => acc + p.items.filter(i => i.completed).length, 0);
  const overallCompletion = Math.round((completedItems / totalItems) * 100) || 0;

  // Role Market Salary Altitude Mapping
  const marketSalaryMap = {
    "Backend Developer": "$130,000 – $175,000 / yr",
    "Frontend Developer": "$125,000 – $165,000 / yr",
    "Data Analyst": "$105,000 – $145,000 / yr",
    "ML Engineer": "$145,000 – $210,000 / yr",
    "DevOps Engineer": "$140,000 – $190,000 / yr",
    "Cybersecurity Specialist": "$135,000 – $185,000 / yr"
  };

  // Chart 1: Skill Acquisition Timeline (Line Chart)
  const lineChartData = {
    labels: ['W1 (Start)', 'W2 (Foundations)', 'W3 (Core Skills)', 'W4 (Projects)', 'W5 (Current)'],
    datasets: [
      {
        label: 'Cumulative Skills Acquired',
        data: [2, 3, 5, 5 + Math.floor(completedItems * 0.8), 5 + completedItems],
        borderColor: '#6B9080',
        backgroundColor: 'rgba(107, 144, 128, 0.15)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#C89B3C',
        pointBorderColor: '#EDEDE3'
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#EDEDE3', font: { family: 'IBM Plex Mono', size: 11 } } }
    },
    scales: {
      x: { ticks: { color: '#A9B4C0', font: { family: 'IBM Plex Mono', size: 10 } }, grid: { color: 'rgba(237, 237, 227, 0.08)' } },
      y: { ticks: { color: '#A9B4C0', font: { family: 'IBM Plex Mono', size: 10 } }, grid: { color: 'rgba(237, 237, 227, 0.08)' } }
    }
  };

  // Chart 2: Target Role Skill Gap (Radar Chart)
  const radarLabels = [...extractedProfile.skills.slice(0, 4).map(s => s.name), ...skillGaps.slice(0, 3).map(g => g.name)];
  const currentScores = [...extractedProfile.skills.slice(0, 4).map(s => s.score), ...skillGaps.slice(0, 3).map(() => 30 + (completedItems * 10))];
  const targetScores = [...extractedProfile.skills.slice(0, 4).map(() => 95), ...skillGaps.slice(0, 3).map(() => 90)];

  const radarChartData = {
    labels: radarLabels,
    datasets: [
      {
        label: 'Current Skill Depth',
        data: currentScores,
        backgroundColor: 'rgba(200, 155, 60, 0.25)',
        borderColor: '#C89B3C',
        borderWidth: 2,
        pointBackgroundColor: '#C89B3C'
      },
      {
        label: 'Target Role Benchmark',
        data: targetScores,
        backgroundColor: 'rgba(107, 144, 128, 0.15)',
        borderColor: '#6B9080',
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointBackgroundColor: '#6B9080'
      }
    ]
  };

  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#EDEDE3', font: { family: 'IBM Plex Mono', size: 11 } } }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(237, 237, 227, 0.15)' },
        grid: { color: 'rgba(237, 237, 227, 0.12)' },
        pointLabels: { color: '#EDEDE3', font: { family: 'IBM Plex Mono', size: 10 } },
        ticks: { backdropColor: 'transparent', color: '#A9B4C0', font: { size: 9 } }
      }
    }
  };

  return (
    <div className="space-y-8 font-mono text-xs">
      
      {/* Printable Certificate Modal */}
      <SurveyCertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
      />

      {/* Header Field Log Banner */}
      <div className="bg-[#16324F] p-5 rounded border border-[#C89B3C]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#C89B3C] font-bold text-sm">
            <Activity className="w-4 h-4" />
            <span>ENGINEERING FIELD LOG & ANALYTICS</span>
          </div>
          <p className="text-[#A9B4C0] text-xs font-body mt-1">
            Real-time skill trajectory telemetry and radar gap comparison for <strong className="text-[#EDEDE3]">{targetRole}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCertificateModal(true)}
            className="px-4 py-2 rounded bg-[#C89B3C] hover:bg-[#b08732] text-[#10243E] font-bold text-xs tracking-wider flex items-center gap-2 shadow transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>EXPORT FIELD REPORT</span>
          </button>
        </div>
      </div>

      {/* LIVE MARKET TELEMETRY & SALARY ALTITUDE WIDGET (STANDOUT FEATURE) */}
      <div className="p-4 rounded bg-[#10243E] border border-[#6B9080]/50 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#16324F] border border-[#6B9080] flex items-center justify-center text-[#6B9080] shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-[#A9B4C0] uppercase">SALARY ALTITUDE INDEX:</div>
            <div className="font-bold text-[#EDEDE3] text-sm">{marketSalaryMap[targetRole] || '$130,000/yr'}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#16324F] border border-[#C89B3C] flex items-center justify-center text-[#C89B3C] shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-[#A9B4C0] uppercase">MARKET DEMAND VELOCITY:</div>
            <div className="font-bold text-[#C89B3C] text-sm">+24% YoY Hiring Volume</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#16324F] border border-[#B5563C] flex items-center justify-center text-[#B5563C] shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-[#A9B4C0] uppercase">TIME TO 95% MATCH TARGET:</div>
            <div className="font-bold text-[#EDEDE3] text-sm">~4.5 Weeks at current pace</div>
          </div>
        </div>
      </div>

      {/* TOP 4 FIELD METRIC CARDS & RULER GAUGE METERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#16324F] p-4 rounded border border-[#EDEDE3]/15 space-y-3">
          <div className="text-[10px] text-[#A9B4C0] uppercase tracking-wider">ROLE MATCH CAPACITY</div>
          <div className="text-3xl font-bold font-mono text-[#6B9080]">{matchPercentage}%</div>
          <ProgressMeter label="TARGET ALIGNMENT" value={matchPercentage} color="#6B9080" />
        </div>

        <div className="bg-[#16324F] p-4 rounded border border-[#EDEDE3]/15 space-y-3">
          <div className="text-[10px] text-[#A9B4C0] uppercase tracking-wider">ROADMAP COMPLETION</div>
          <div className="text-3xl font-bold font-mono text-[#C89B3C]">{overallCompletion}%</div>
          <ProgressMeter label="WAYPOINT ROUTE" value={overallCompletion} color="#C89B3C" />
        </div>

        <div className="bg-[#16324F] p-4 rounded border border-[#EDEDE3]/15 space-y-3">
          <div className="text-[10px] text-[#A9B4C0] uppercase tracking-wider">SKILLS ACQUIRED</div>
          <div className="text-3xl font-bold font-mono text-[#EDEDE3]">
            {extractedProfile.skills.length + completedItems}
          </div>
          <ProgressMeter label="CAPABILITY VOLUME" value={(extractedProfile.skills.length + completedItems) * 8} color="#EDEDE3" />
        </div>

        <div className="bg-[#16324F] p-4 rounded border border-[#EDEDE3]/15 space-y-3">
          <div className="text-[10px] text-[#A9B4C0] uppercase tracking-wider">TERRAIN ELEVATION</div>
          <div className="text-3xl font-bold font-mono text-[#B5563C]">
            {Math.min(98, 45 + completedItems * 12)}m
          </div>
          <ProgressMeter label="PEAK HEIGHT" value={Math.min(98, 45 + completedItems * 12)} color="#B5563C" />
        </div>
      </div>

      {/* CHART.JS VISUALIZATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CHART 1: SKILL ACQUISITION TIMELINE (LINE CHART) */}
        <div className="lg:col-span-6 bg-[#16324F] p-5 rounded border border-[#EDEDE3]/15 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EDEDE3]/10 pb-3">
            <div className="flex items-center gap-2 text-[#EDEDE3] font-bold text-sm font-display">
              <TrendingUp className="w-4 h-4 text-[#6B9080]" />
              <span>SKILL ACQUISITION TIMELINE</span>
            </div>
            <span className="text-[10px] text-[#6B9080]">CONTOUR: SAGE</span>
          </div>

          <div className="h-64 relative">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* CHART 2: TARGET ROLE SKILL GAP RADAR */}
        <div className="lg:col-span-6 bg-[#16324F] p-5 rounded border border-[#EDEDE3]/15 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EDEDE3]/10 pb-3">
            <div className="flex items-center gap-2 text-[#EDEDE3] font-bold text-sm font-display">
              <BarChart3 className="w-4 h-4 text-[#C89B3C]" />
              <span>ROLE SKILL GAP RADAR</span>
            </div>
            <span className="text-[10px] text-[#C89B3C]">RADAR COMPARISON</span>
          </div>

          <div className="h-64 relative">
            <Radar data={radarChartData} options={radarChartOptions} />
          </div>
        </div>

      </div>

      {/* DYNAMIC TOPOGRAPHIC TERRAIN SYNCHRONIZATION MAP */}
      <div className="bg-[#16324F] p-5 rounded border border-[#EDEDE3]/15 space-y-4">
        <div className="flex items-center justify-between border-b border-[#EDEDE3]/10 pb-3">
          <div className="flex items-center gap-2 text-[#EDEDE3] font-bold text-sm font-display">
            <Compass className="w-4 h-4 text-[#C89B3C]" />
            <span>SYNCHRONIZED SKILL TERRAIN MAP</span>
          </div>
          <span className="text-[10px] text-[#A9B4C0]">LIVE FIELD ELEVATION</span>
        </div>

        <TerrainMap isMini={false} />
      </div>

    </div>
  );
};
