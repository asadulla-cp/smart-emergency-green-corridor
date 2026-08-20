import React from 'react';
import type { Ambulance, Hospital, IntersectionNode } from '../../types/emergency';
import { Siren, ShieldAlert, MapPin, Building2, Zap, Clock, Navigation, AlertTriangle } from 'lucide-react';

interface ActiveEmergencyPanelProps {
  ambulance: Ambulance;
  destinationHospital: Hospital | null;
  nodes: IntersectionNode[];
  onOpenDispatch: () => void;
  onTriggerReroute: () => void;
}

export const ActiveEmergencyPanel: React.FC<ActiveEmergencyPanelProps> = ({
  ambulance,
  destinationHospital,
  nodes,
  onOpenDispatch,
  onTriggerReroute
}) => {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const currentLocationNode = nodeMap.get(ambulance.currentLocationNodeId);

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <Siren className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-200 tracking-wider uppercase">Active Emergency</h2>
            <p className="text-[11px] text-slate-400">Real-Time Telemetry & Corridor Sync</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getPriorityBadge(ambulance.patientSeverity)}`}>
          {ambulance.patientSeverity}
        </span>
      </div>

      <div className="space-y-3">
        <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Vehicle ID</span>
            <span className="text-emerald-400 font-bold font-mono text-sm">{ambulance.vehicleId}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Emergency Case</span>
            <span className="text-slate-200 font-semibold">{ambulance.emergencyType}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Vehicle Type</span>
            <span className="text-slate-300">{ambulance.type}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mb-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Current Position</span>
            </div>
            <div className="text-xs font-bold text-slate-100 truncate">
              {currentLocationNode ? currentLocationNode.name : 'En Route'}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mb-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target Hospital</span>
            </div>
            <div className="text-xs font-bold text-slate-100 truncate">
              {destinationHospital ? destinationHospital.name : 'City General'}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/40 to-teal-950/30 rounded-xl p-4 border border-emerald-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-emerald-400 font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Optimized ETA
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight mt-0.5">
                {ambulance.currentEtaMin.toFixed(1)} <span className="text-xs text-emerald-400 font-normal">min</span>
              </div>
              <div className="text-[11px] text-emerald-300/80 mt-1 flex items-center gap-1">
                <span>Initial: {ambulance.withoutCorridorEtaMin.toFixed(1)} min</span>
                <span className="font-bold text-emerald-400">(-{ambulance.timeSavedMin.toFixed(1)} min saved)</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-slate-400 mb-1">Green Corridor</div>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold shadow-lg shadow-emerald-500/10 animate-pulse">
                <Zap className="w-4 h-4 fill-emerald-400" />
                <span>ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="mt-3.5">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Route Progress</span>
              <span>{Math.round(((ambulance.currentEdgeIndex + ambulance.progressPercent) / Math.max(1, ambulance.assignedRoute.length - 1)) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round(((ambulance.currentEdgeIndex + ambulance.progressPercent) / Math.max(1, ambulance.assignedRoute.length - 1)) * 100))}%`
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400">Current Speed</div>
            <div className="text-sm font-bold text-slate-200 mt-0.5">{ambulance.currentSpeedKmh} <span className="text-[10px] text-slate-500 font-normal">km/h</span></div>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400">Signals Cleared</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">{ambulance.greenSignalsCleared} <span className="text-[10px] text-emerald-500">🟢</span></div>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400">Reroute Count</div>
            <div className="text-sm font-bold text-slate-200 mt-0.5">{ambulance.rerouteCount}</div>
          </div>
        </div>

        {ambulance.lastRerouteReason && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-300 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Dynamic Reroute Triggered:</span> {ambulance.lastRerouteReason}
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-800 flex gap-2">
        <button
          onClick={onTriggerReroute}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center space-x-1.5 transition-all"
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
          <span>Recalculate A* Path</span>
        </button>

        <button
          onClick={onOpenDispatch}
          className="py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-xs font-semibold text-emerald-400 border border-emerald-500/40 flex items-center justify-center space-x-1 transition-all"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Dispatch New</span>
        </button>
      </div>
    </div>
  );
};
