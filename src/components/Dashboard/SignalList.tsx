import React from 'react';
import type { IntersectionNode } from '../../types/emergency';
import { Radio, Clock } from 'lucide-react';

interface SignalListProps {
  nodes: IntersectionNode[];
  corridorNodeIds: string[];
  currentEdgeIndex: number;
}

export const SignalList: React.FC<SignalListProps> = ({ nodes, corridorNodeIds, currentEdgeIndex }) => {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const corridorSignals = corridorNodeIds.map(id => nodeMap.get(id)).filter((n): n is IntersectionNode => n !== undefined && n.hasSignal);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-200 tracking-wider uppercase">Active Corridor Traffic Signals</h2>
            <p className="text-[11px] text-slate-400">Coordinated Automated Signal Locking</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-400 font-mono">
          {corridorSignals.length} SIGNALS SYNCED
        </span>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {corridorSignals.map((node, index) => {
          const isPassed = index < currentEdgeIndex;
          const isApproaching = index === currentEdgeIndex || index === currentEdgeIndex + 1;
          const isOverride = node.isGreenCorridorActive;

          return (
            <div
              key={node.id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                isApproaching
                  ? 'bg-emerald-950/40 border-emerald-500/40 shadow-md shadow-emerald-500/5'
                  : isPassed
                  ? 'bg-slate-950/40 border-slate-800 opacity-60'
                  : 'bg-slate-950/70 border-slate-800/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                    node.signalState === 'GREEN'
                      ? 'bg-emerald-500 shadow-md shadow-emerald-500/50 animate-pulse'
                      : node.signalState === 'YELLOW'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                ></div>
                <div>
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span>{node.name}</span>
                    {isOverride && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/30">
                        CORRIDOR GREEN
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Signal #{node.id} • {isPassed ? 'Passed' : isApproaching ? 'Approaching Now' : 'Queued Ahead'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {isOverride ? '45s LOCK' : `${node.signalTimer}s`}
                </div>
                <div className="text-[10px] text-slate-400">
                  {isOverride ? 'Priority Phase' : node.signalState}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
