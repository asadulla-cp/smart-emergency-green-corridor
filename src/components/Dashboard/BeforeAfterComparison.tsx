import React from 'react';
import type { RouteComparison } from '../../types/emergency';
import { Zap, ShieldCheck, TrendingDown, AlertCircle } from 'lucide-react';

interface BeforeAfterComparisonProps {
  comparison: RouteComparison;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({ comparison }) => {
  const percentSaved = Math.round((comparison.timeSavedMinutes / Math.max(1, comparison.withoutCorridorEta)) * 100);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-200 tracking-wider uppercase">Green Corridor Impact</h2>
            <p className="text-[11px] text-slate-400">Before vs. After Optimization Benchmark</p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
          SYSTEM BENEFIT MEASURED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-slate-950/80 rounded-xl p-4 border border-rose-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Standard Uncoordinated Traffic
            </span>
            <span className="text-[10px] text-slate-500 font-mono">BASELINE</span>
          </div>

          <div className="text-2xl font-extrabold text-slate-200 tracking-tight">
            {comparison.withoutCorridorEta.toFixed(1)} <span className="text-xs text-slate-400 font-normal">min ETA</span>
          </div>

          <div className="mt-3 space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
            <div className="flex justify-between">
              <span>Red Light Delays</span>
              <span className="text-rose-400 font-semibold">{comparison.withoutCorridorRedSignals} signals (~{comparison.withoutCorridorRedSignals * 45}s)</span>
            </div>
            <div className="flex justify-between">
              <span>Traffic Congestion Penalty</span>
              <span className="text-amber-400 font-semibold">+{comparison.trafficDelayMinutes.toFixed(1)} min</span>
            </div>
            <div className="flex justify-between">
              <span>Average Speed</span>
              <span className="text-slate-300">28 km/h</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/40 to-teal-950/30 rounded-xl p-4 border border-emerald-500/40 relative overflow-hidden shadow-lg shadow-emerald-500/5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              AEGIS Green Corridor Active
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded">OPTIMIZED</span>
          </div>

          <div className="text-2xl font-extrabold text-emerald-400 tracking-tight">
            {comparison.withCorridorEta.toFixed(1)} <span className="text-xs text-emerald-300 font-normal">min ETA</span>
          </div>

          <div className="mt-3 space-y-1.5 text-xs text-slate-300 border-t border-emerald-500/20 pt-2.5">
            <div className="flex justify-between">
              <span>Red Light Delays</span>
              <span className="text-emerald-400 font-bold">0 signals (100% Cleared)</span>
            </div>
            <div className="flex justify-between">
              <span>Traffic Congestion Penalty</span>
              <span className="text-emerald-400 font-bold">0.0 min (Priority Lane)</span>
            </div>
            <div className="flex justify-between">
              <span>Average Speed</span>
              <span className="text-emerald-300 font-bold">68 km/h</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-3.5 text-white flex items-center justify-between shadow-lg shadow-emerald-600/20 border border-emerald-400/40">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-white/10 text-white">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Total Measurable Time Saved</div>
            <div className="text-2xl font-black tracking-tight">
              {comparison.timeSavedMinutes.toFixed(1)} MINUTES FASTER ({percentSaved}% Reduction)
            </div>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[10px] uppercase font-bold text-emerald-200 block">Critical Priority</span>
          <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full border border-white/30">LIFE SAVED</span>
        </div>
      </div>
    </div>
  );
};
