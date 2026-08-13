import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mountain, Compass, ShieldAlert, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export const TerrainMap = ({ isMini = false }) => {
  const { terrainNodes, targetRole, matchPercentage } = useApp();
  const [selectedNode, setSelectedNode] = useState(null);

  // Generate SVG concentric topographic contour paths around a center node
  const renderContourRings = (node) => {
    const isAchieved = node.status === 'achieved';
    const baseColor = isAchieved ? '#6B9080' : '#B5563C';
    const rings = Math.max(2, Math.floor(node.elevation / 20));

    return Array.from({ length: rings }).map((_, idx) => {
      const radius = (rings - idx) * (isMini ? 8 : 14);
      const opacity = 0.15 + (idx * 0.18);

      return (
        <circle
          key={`ring-${node.id}-${idx}`}
          cx={`${node.x}%`}
          cy={`${node.y}%`}
          r={radius}
          fill="none"
          stroke={baseColor}
          strokeWidth="1.2"
          strokeDasharray={idx % 2 === 1 ? "4,3" : "none"}
          opacity={opacity}
          className="transition-all duration-700 ease-out"
        />
      );
    });
  };

  return (
    <div className={`relative bg-[#10243E] border border-[#EDEDE3]/20 rounded-md overflow-hidden bg-blueprint-grid ${isMini ? 'h-64' : 'h-[500px]'}`}>
      
      {/* Blueprint Topography Header Overlay */}
      <div className="absolute top-3 left-3 z-10 bg-[#16324F]/90 backdrop-blur px-3 py-1.5 rounded border border-[#EDEDE3]/15 font-mono text-xs flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[#C89B3C]">
          <Compass className="w-4 h-4" />
          <span className="font-bold tracking-wider">TOPOGRAPHIC SURVEY</span>
        </div>
        <div className="text-[#A9B4C0] border-l border-[#EDEDE3]/20 pl-3 hidden sm:block">
          GRID: {targetRole.toUpperCase()} · SCALE 1:5000
        </div>
        <div className="text-[#6B9080] font-bold border-l border-[#EDEDE3]/20 pl-3">
          ELEVATION {matchPercentage}%
        </div>
      </div>

      {/* SVG Canvas for Topographic Terrain Mesh */}
      <svg className="w-full h-full absolute inset-0">
        
        {/* Decorative Grid Coordinates Lines */}
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(200, 155, 60, 0.12)" strokeWidth="1" strokeDasharray="6,4" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(200, 155, 60, 0.12)" strokeWidth="1" strokeDasharray="6,4" />

        {/* Dynamic Route Waypoint Path connecting nodes */}
        {terrainNodes.length > 1 && (
          <path
            d={`M ${terrainNodes.map(n => `${n.x * 7.5},${n.y * 4.5}`).join(' L ')}`}
            fill="none"
            stroke="#C89B3C"
            strokeWidth="1.5"
            strokeDasharray="5,5"
            opacity="0.4"
          />
        )}

        {/* Contour Rings for each skill peak */}
        {terrainNodes.map(node => renderContourRings(node))}

        {/* Skill Peak Markers */}
        {terrainNodes.map((node) => {
          const isAchieved = node.status === 'achieved';
          const nodeColor = isAchieved ? '#6B9080' : '#B5563C';
          const isSelected = selectedNode?.id === node.id;

          return (
            <g
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className="cursor-pointer group"
            >
              {/* Pulse effect on hover */}
              <circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={isMini ? 12 : 22}
                fill={nodeColor}
                opacity="0.15"
                className="group-hover:scale-125 transition-transform duration-300"
              />

              {/* Central Core Peak Pin */}
              <circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={isMini ? 4 : 7}
                fill={isSelected ? '#C89B3C' : nodeColor}
                stroke="#EDEDE3"
                strokeWidth="1.8"
                className="transition-colors duration-300"
              />

              {/* Node Peak Label */}
              <text
                x={`${node.x}%`}
                y={`${node.y + (isMini ? 6 : 7)}%`}
                textAnchor="middle"
                fill="#EDEDE3"
                fontSize={isMini ? "9 text-mono" : "11"}
                fontFamily="IBM Plex Mono"
                fontWeight="600"
                className="pointer-events-none drop-shadow-md"
              >
                {node.name.toUpperCase()} ({node.elevation}m)
              </text>
            </g>
          );
        })}
      </svg>

      {/* Terrain Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-10 bg-[#16324F]/90 backdrop-blur px-3 py-1.5 rounded border border-[#EDEDE3]/15 font-mono text-[10px] flex items-center gap-4 text-[#A9B4C0]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#6B9080]" />
          <span>ACHIEVED PEAKS (MASTERY)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B5563C]" />
          <span>UNCHARTED GAPS (TERRAIN)</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#C89B3C]">
          <Sparkles className="w-3 h-3" />
          <span>ROUTE WAYPOINT</span>
        </div>
      </div>

      {/* Node Detail Popup Tooltip Card */}
      {selectedNode && (
        <div className="absolute bottom-12 right-3 z-20 bg-[#16324F] border border-[#C89B3C] p-3 rounded-md shadow-xl w-64 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-[#EDEDE3]/15 pb-1.5 mb-2">
            <span className="font-bold text-[#EDEDE3]">{selectedNode.name}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
              selectedNode.status === 'achieved' 
                ? 'bg-[#6B9080]/20 text-[#6B9080] border border-[#6B9080]' 
                : 'bg-[#B5563C]/20 text-[#B5563C] border border-[#B5563C]'
            }`}>
              {selectedNode.status.toUpperCase()}
            </span>
          </div>
          <div className="space-y-1 text-[#A9B4C0]">
            <div>CATEGORY: <span className="text-[#EDEDE3]">{selectedNode.category}</span></div>
            <div>ELEVATION (DEPTH): <span className="text-[#C89B3C] font-bold">{selectedNode.elevation}%</span></div>
            <div>COORDINATES: <span className="text-[#EDEDE3]">X:{selectedNode.x} | Y:{selectedNode.y}</span></div>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="mt-2 text-[10px] text-[#A9B4C0] hover:text-[#EDEDE3] underline block text-right w-full"
          >
            [CLOSE SURVEY]
          </button>
        </div>
      )}
    </div>
  );
};
