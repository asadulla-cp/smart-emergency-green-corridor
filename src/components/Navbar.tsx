import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Navigation, BarChart3, Radio, Play, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'network' | 'analytics';
  setActiveTab: (tab: 'dashboard' | 'network' | 'analytics') => void;
  onOpenDispatch: () => void;
  onStartSimulation: () => void;
  onTriggerFailureScenario: () => void;
  isSimulating: boolean;
  activeCorridorCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDispatch,
  onStartSimulation,
  onTriggerFailureScenario,
  isSimulating,
  activeCorridorCount
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-6 py-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
            <Activity className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                AEGIS <span className="text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">GREEN CORRIDOR OS</span>
              </h1>
              {activeCorridorCount > 0 && (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {activeCorridorCount} CORRIDOR ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">Smart Emergency Traffic Signal Coordination & Dynamic Routing</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-sm">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Command Center</span>
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'network'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Road Network & Signals</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics & Performance</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-3">
          <button
            onClick={onStartSimulation}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg ${
              isSimulating
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30 border border-emerald-400/40'
            }`}
          >
            <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'SIMULATION RUNNING...' : '▶ DEMO SIMULATION'}</span>
          </button>

          <button
            onClick={onTriggerFailureScenario}
            title="Inject dynamic road block mid-journey to demonstrate instant A* rerouting"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Test Rerouting Failure</span>
          </button>

          <button
            onClick={onOpenDispatch}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>Dispatch Unit</span>
          </button>

          <div className="hidden sm:flex flex-col text-right pl-2 border-l border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-200">{timeStr}</span>
            <span className="text-[10px] text-slate-500 font-medium">UTC+05:30 HQ</span>
          </div>
        </div>
      </div>
    </header>
  );
};
