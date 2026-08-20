import React from 'react';
import { Siren, Truck, Zap, Clock, AlertOctagon, Activity } from 'lucide-react';

interface TopStatsBarProps {
  activeEmergenciesCount: number;
  activeAmbulancesCount: number;
  activeCorridorsCount: number;
  avgEtaMin: number;
  congestionLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  roadClosuresCount: number;
}

export const TopStatsBar: React.FC<TopStatsBarProps> = ({
  activeEmergenciesCount,
  activeAmbulancesCount,
  activeCorridorsCount,
  avgEtaMin,
  congestionLevel,
  roadClosuresCount
}) => {
  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'MODERATE': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'HIGH': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'SEVERE': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
      {/* 1. Active Emergencies */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center space-x-3 shadow-md">
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <Siren className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Active Emergencies</div>
          <div className="text-xl font-bold text-slate-100 flex items-center gap-1.5">
            {activeEmergenciesCount}
            {activeEmergenciesCount > 0 && (
              <span className="text-[10px] text-rose-400 font-semibold px-1.5 py-0.2 rounded bg-rose-500/20">CRITICAL</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Active Ambulances */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center space-x-3 shadow-md">
        <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Active Ambulances</div>
          <div className="text-xl font-bold text-slate-100">{activeAmbulancesCount} <span className="text-xs text-slate-500 font-normal">Dispatched</span></div>
        </div>
      </div>

      {/* 3. Green Corridors */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center space-x-3 shadow-md relative overflow-hidden">
        {activeCorridorsCount > 0 && (
          <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-emerald-500/10 blur-xl pointer-events-none"></div>
        )}
        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Green Corridors</div>
          <div className="text-xl font-bold text-emerald-400 flex items-center gap-1">
            {activeCorridorsCount}
            {activeCorridorsCount > 0 ? (
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30 animate-pulse">ACTIVE</span>
            ) : (
              <span className="text-xs text-slate-500 font-normal">Standby</span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Average ETA */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center space-x-3 shadow-md">
        <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Average ETA</div>
          <div className="text-xl font-bold text-slate-100">
            {avgEtaMin.toFixed(1)} <span className="text-xs text-emerald-400 font-medium">min (-43%)</span>
          </div>
        </div>
      </div>

      {/* 5. Traffic Congestion */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center space-x-3 shadow-md">
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Traffic Congestion</div>
          <div className="text-xl font-bold text-slate-100 flex items-center gap-1.5">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${getCongestionColor(congestionLevel)}`}>
              {congestionLevel}
            </span>
          </div>
        </div>
      </div>

      {/* 6. Road Incidents / Closures */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center space-x-3 shadow-md">
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Road Hazards</div>
          <div className="text-xl font-bold text-slate-100">
            {roadClosuresCount} <span className="text-xs text-slate-500 font-normal">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
