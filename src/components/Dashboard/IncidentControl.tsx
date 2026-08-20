import React, { useState } from 'react';
import type { RoadEdge, IncidentType } from '../../types/emergency';
import { AlertOctagon, Plus, Flame, Ban } from 'lucide-react';

interface IncidentControlProps {
  edges: RoadEdge[];
  onToggleBlockEdge: (edgeId: string, incidentType: IncidentType) => void;
  onTriggerRerouteDemo: () => void;
}

export const IncidentControl: React.FC<IncidentControlProps> = ({
  edges,
  onToggleBlockEdge,
  onTriggerRerouteDemo
}) => {
  const [selectedEdgeId, setSelectedEdgeId] = useState<string>(edges[0]?.id || '');
  const [selectedType, setSelectedType] = useState<IncidentType>('ACCIDENT');

  const blockedEdges = edges.filter(e => e.isBlocked);

  const handleInject = () => {
    if (!selectedEdgeId) return;
    onToggleBlockEdge(selectedEdgeId, selectedType);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-200 tracking-wider uppercase">Road Hazard & Blockage Admin</h2>
            <p className="text-[11px] text-slate-400">Simulate Dynamic Accidents & Triggers</p>
          </div>
        </div>
        <span className="text-xs font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
          {blockedEdges.length} BLOCKED
        </span>
      </div>

      <div className="space-y-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
        <div>
          <label className="text-xs font-medium text-slate-400 block mb-1">Target Road Segment</label>
          <select
            value={selectedEdgeId}
            onChange={e => setSelectedEdgeId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            {edges.map(e => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.isBlocked ? '⚠️ CURRENTLY BLOCKED' : e.trafficLevel + ' Traffic'})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">Incident Type</label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value as IncidentType)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="ACCIDENT">🚗 Major Vehicle Accident</option>
              <option value="ROAD_CLOSURE">🚧 Emergency Road Closure</option>
              <option value="FLOODING">🌧️ Flash Flooding</option>
              <option value="CONSTRUCTION">🏗️ Road Construction</option>
              <option value="TRAFFIC_JAM">🚙 Gridlock Jam</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleInject}
              className="w-full py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center space-x-1 shadow-md shadow-rose-600/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Toggle Road Block</span>
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={onTriggerRerouteDemo}
        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-900/60 to-amber-900/60 hover:from-rose-800 hover:to-amber-800 text-rose-200 border border-rose-500/40 text-xs font-bold flex items-center justify-center space-x-2 shadow-lg transition-all"
      >
        <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
        <span>⚡ SIMULATE SUDDEN ACCIDENT ON AMBULANCE ROUTE</span>
      </button>

      {blockedEdges.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Road Blockages</div>
          {blockedEdges.map(e => (
            <div key={e.id} className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Ban className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-semibold text-slate-200">{e.name}</span>
              </div>
              <button
                onClick={() => onToggleBlockEdge(e.id, 'ACCIDENT')}
                className="text-[10px] text-rose-300 hover:text-white underline font-semibold"
              >
                Clear Hazard
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
