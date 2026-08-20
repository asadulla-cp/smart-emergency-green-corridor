import React, { useState } from 'react';
import type { IntersectionNode, RoadEdge, Hospital, Ambulance, RoadIncident } from '../../types/emergency';
import { Layers, Radio } from 'lucide-react';

interface CityMapProps {
  nodes: IntersectionNode[];
  edges: RoadEdge[];
  hospitals: Hospital[];
  ambulances: Ambulance[];
  incidents: RoadIncident[];
  onSelectNode: (node: IntersectionNode) => void;
  onSelectEdge: (edge: RoadEdge) => void;
  onSelectHospital: (hospital: Hospital) => void;
  activeAmbulanceId?: string;
}

export const CityMap: React.FC<CityMapProps> = ({
  nodes,
  edges,
  hospitals,
  ambulances,
  incidents,
  onSelectNode,
  onSelectEdge,
  onSelectHospital,
  activeAmbulanceId
}) => {
  const [hoveredNode, setHoveredNode] = useState<IntersectionNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<RoadEdge | null>(null);

  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const activeAmb = ambulances.find(a => a.id === activeAmbulanceId) || ambulances[0];

  const corridorEdgeIds = new Set<string>();
  if (activeAmb && activeAmb.assignedRoute && activeAmb.assignedRoute.length >= 2) {
    const route = activeAmb.assignedRoute;
    for (let i = 0; i < route.length - 1; i++) {
      const u = route[i];
      const v = route[i + 1];
      const edge = edges.find(
        e => (e.fromNodeId === u && e.toNodeId === v) || (e.fromNodeId === v && e.toNodeId === u)
      );
      if (edge) corridorEdgeIds.add(edge.id);
    }
  }

  const getEdgeStroke = (edge: RoadEdge) => {
    if (edge.isBlocked) return '#EF4444';
    switch (edge.trafficLevel) {
      case 'LOW': return '#10B981';
      case 'MODERATE': return '#F59E0B';
      case 'HIGH': return '#F97316';
      case 'SEVERE': return '#DC2626';
    }
  };

  return (
    <div className="relative w-full h-[620px] bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden command-backdrop select-none">
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-3 pointer-events-none">
        <div className="glass-panel px-3.5 py-2 rounded-xl flex items-center space-x-2.5 shadow-lg border border-slate-700/60 pointer-events-auto">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">TACTICAL CITY GRID MAP</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>

        {activeAmb && activeAmb.status === 'EN_ROUTE' && (
          <div className="glass-panel-emerald px-3.5 py-2 rounded-xl flex items-center space-x-2 shadow-lg border border-emerald-500/40 pointer-events-auto">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-300">GREEN CORRIDOR ACTIVE - {activeAmb.vehicleId}</span>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 z-20 glass-panel p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5 hidden sm:block">
        <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Map Legend</div>
        <div className="flex items-center space-x-2">
          <span className="w-6 h-1 bg-emerald-500 rounded"></span>
          <span>Green Corridor / Low Traffic</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-6 h-1 bg-amber-500 rounded"></span>
          <span>Moderate Traffic</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-6 h-1 bg-rose-600 rounded"></span>
          <span>Heavy/Severe Traffic</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-6 h-1 bg-rose-500 rounded stroke-dasharray"></span>
          <span>🚫 Blocked / Road Incident</span>
        </div>
        <div className="flex items-center space-x-3 pt-1 border-t border-slate-800">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-[10px]">Signal Green</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-[10px]">Signal Red</span>
          </div>
        </div>
      </div>

      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="corridorGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {edges.map(edge => {
          const fromNode = nodeMap.get(edge.fromNodeId);
          const toNode = nodeMap.get(edge.toNodeId);
          if (!fromNode || !toNode) return null;

          const isCorridor = corridorEdgeIds.has(edge.id);
          const isBlocked = edge.isBlocked;

          return (
            <g key={edge.id} className="cursor-pointer" onClick={() => onSelectEdge(edge)} onMouseEnter={() => setHoveredEdge(edge)} onMouseLeave={() => setHoveredEdge(null)}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={isBlocked ? '#EF4444' : getEdgeStroke(edge)}
                strokeWidth={isCorridor ? '1.8' : '1.1'}
                strokeOpacity={isBlocked ? '0.9' : '0.4'}
              />

              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={isBlocked ? '#7F1D1D' : getEdgeStroke(edge)}
                strokeWidth="0.6"
                strokeDasharray={isBlocked ? '1 1' : 'none'}
              />

              {isCorridor && !isBlocked && (
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#10B981"
                  strokeWidth="1.6"
                  filter="url(#corridorGlow)"
                  className="animate-corridor"
                  strokeLinecap="round"
                />
              )}

              {hoveredEdge?.id === edge.id && (
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2 - 1.5}
                  fill="#F8FAFC"
                  fontSize="1.8"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="pointer-events-none drop-shadow"
                >
                  {edge.name} ({edge.trafficLevel})
                </text>
              )}
            </g>
          );
        })}

        {nodes.map(node => {
          const isCorridorActive = node.isGreenCorridorActive;
          const signalColor = node.signalState === 'GREEN' ? '#10B981' : node.signalState === 'YELLOW' ? '#F59E0B' : '#EF4444';

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer"
              onClick={() => onSelectNode(node)}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {isCorridorActive && (
                <circle
                  r="2.5"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="0.4"
                  strokeDasharray="1 1"
                  className="animate-spin"
                  style={{ animationDuration: '4s' }}
                />
              )}

              <circle
                r="1.2"
                fill="#0F172A"
                stroke={isCorridorActive ? '#10B981' : '#334155'}
                strokeWidth={isCorridorActive ? '0.5' : '0.3'}
              />

              {node.hasSignal && (
                <circle
                  r="0.7"
                  fill={signalColor}
                  className={isCorridorActive ? 'animate-pulse' : ''}
                />
              )}

              <text
                y="2.6"
                fill="#94A3B8"
                fontSize="1.3"
                fontWeight="500"
                textAnchor="middle"
                className="pointer-events-none"
              >
                {node.name}
              </text>
            </g>
          );
        })}

        {incidents.filter(i => !i.isResolved).map(incident => {
          const edge = edges.find(e => e.id === incident.edgeId);
          if (!edge) return null;
          const from = nodeMap.get(edge.fromNodeId);
          const to = nodeMap.get(edge.toNodeId);
          if (!from || !to) return null;

          const cx = (from.x + to.x) / 2;
          const cy = (from.y + to.y) / 2;

          return (
            <g key={incident.id} transform={`translate(${cx}, ${cy})`} className="cursor-pointer animate-bounce">
              <circle r="1.8" fill="#EF4444" fillOpacity="0.3" stroke="#EF4444" strokeWidth="0.4" />
              <text y="0.6" fill="#FFFFFF" fontSize="1.6" fontWeight="bold" textAnchor="middle">
                ⚠️
              </text>
            </g>
          );
        })}

        {hospitals.map(hospital => {
          const hNode = nodeMap.get(hospital.nodeId);
          if (!hNode) return null;

          return (
            <g
              key={hospital.id}
              transform={`translate(${hNode.x - 2.5}, ${hNode.y - 3})`}
              className="cursor-pointer"
              onClick={() => onSelectHospital(hospital)}
            >
              <rect
                width="5"
                height="3.8"
                rx="0.8"
                fill="#0284C7"
                stroke="#38BDF8"
                strokeWidth="0.3"
                className="drop-shadow-lg"
              />
              <text x="2.5" y="2.4" fill="#FFFFFF" fontSize="1.8" fontWeight="bold" textAnchor="middle">
                🏥
              </text>
              <text x="2.5" y="5.0" fill="#38BDF8" fontSize="1.1" fontWeight="bold" textAnchor="middle">
                {hospital.name.split(' ')[0]}
              </text>
            </g>
          );
        })}

        {ambulances.map(amb => {
          if (amb.status !== 'EN_ROUTE' && amb.status !== 'DISPATCHED') return null;

          let ax = 15;
          let ay = 25;

          if (amb.currentLat && amb.currentLng) {
            const route = amb.assignedRoute;
            if (route && route.length >= 2) {
              const u = nodeMap.get(route[amb.currentEdgeIndex]);
              const v = nodeMap.get(route[amb.currentEdgeIndex + 1]);
              if (u && v) {
                ax = u.x + (v.x - u.x) * amb.progressPercent;
                ay = u.y + (v.y - u.y) * amb.progressPercent;
              }
            }
          }

          return (
            <g key={amb.id} transform={`translate(${ax}, ${ay})`} className="cursor-pointer">
              <circle r="3.2" fill="#EF4444" fillOpacity="0.25" className="animate-ping" />
              <circle r="2.0" fill="#10B981" fillOpacity="0.4" />

              <circle r="1.4" fill="#1E293B" stroke="#10B981" strokeWidth="0.4" />
              <text y="0.5" fill="#FFFFFF" fontSize="1.3" textAnchor="middle" fontWeight="bold">
                🚑
              </text>

              <rect x="-4" y="-3.5" width="8" height="2" rx="0.5" fill="#0F172A" stroke="#10B981" strokeWidth="0.2" />
              <text x="0" y="-2.1" fill="#10B981" fontSize="1.0" fontWeight="bold" textAnchor="middle">
                {amb.vehicleId} ({amb.currentSpeedKmh} km/h)
              </text>
            </g>
          );
        })}
      </svg>

      {hoveredNode && (
        <div
          className="absolute z-30 pointer-events-none glass-panel p-2.5 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1"
          style={{ top: `${hoveredNode.y + 2}%`, left: `${hoveredNode.x + 2}%` }}
        >
          <div className="font-bold text-slate-100 flex items-center justify-between gap-3">
            <span>{hoveredNode.name}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                hoveredNode.signalState === 'GREEN'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : hoveredNode.signalState === 'YELLOW'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              SIGNAL {hoveredNode.signalState}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Green Corridor:{' '}
            <span className={hoveredNode.isGreenCorridorActive ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              {hoveredNode.isGreenCorridorActive ? 'ACTIVE (OVERRIDE)' : 'INACTIVE'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
