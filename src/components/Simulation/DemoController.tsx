import React from 'react';
import { Play, RotateCcw, AlertTriangle, Zap, Pause } from 'lucide-react';

interface DemoControllerProps {
  isSimulating: boolean;
  simStep: number;
  totalSteps: number;
  currentStepLabel: string;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onTriggerReroute: () => void;
}

export const DemoController: React.FC<DemoControllerProps> = ({
  isSimulating,
  simStep,
  totalSteps,
  currentStepLabel,
  onStart,
  onPause,
  onReset,
  onTriggerReroute
}) => {
  const progressPercent = Math.round((simStep / Math.max(1, totalSteps)) * 100);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={isSimulating ? onPause : onStart}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center space-x-2 shadow-lg transition-all ${
              isSimulating
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isSimulating ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>PAUSE SIMULATION</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>▶ START EMERGENCY SIMULATION</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            title="Reset Simulation State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onTriggerReroute}
            className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Test Road Block Reroute</span>
          </button>
        </div>

        <div className="flex-1 bg-slate-950/80 rounded-xl px-4 py-2 border border-slate-800 flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
            <Zap className="w-4 h-4 animate-pulse" />
          </div>
          <div className="truncate">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Scenario Workflow Step {simStep}/{totalSteps}</div>
            <div className="text-xs font-bold text-slate-100 truncate">{currentStepLabel || 'Ready to start simulation scenario'}</div>
          </div>
        </div>

        <div className="w-full lg:w-48 text-right">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Scenario Completion</span>
            <span className="font-bold text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
