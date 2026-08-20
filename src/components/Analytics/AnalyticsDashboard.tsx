import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingDown, Zap, Clock, ShieldCheck, Activity } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const responseTimeData = [
    { trip: 'Trip #101', withoutCorridor: 15.2, withCorridor: 8.5, saved: 6.7 },
    { trip: 'Trip #102', withoutCorridor: 14.0, withCorridor: 7.8, saved: 6.2 },
    { trip: 'Trip #103', withoutCorridor: 18.5, withCorridor: 9.4, saved: 9.1 },
    { trip: 'Trip #104 (Current)', withoutCorridor: 14.5, withCorridor: 8.2, saved: 6.3 },
    { trip: 'Trip #105', withoutCorridor: 16.0, withCorridor: 8.9, saved: 7.1 },
    { trip: 'Trip #106', withoutCorridor: 12.8, withCorridor: 7.1, saved: 5.7 }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Emergency Trips</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">106 Trips</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">100% Green Corridor Success</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Avg Response Time Saved</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-teal-400">6.8 Mins</div>
          <div className="text-[11px] text-teal-300 mt-1 font-medium">44.2% Faster Hospital Arrival</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Signals Cleared Automatically</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">742 Signals</div>
          <div className="text-[11px] text-amber-300 mt-1 font-medium">0 Red Light Halts</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Dynamic Reroutes Handled</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100">14 Hazards</div>
          <div className="text-[11px] text-rose-400 mt-1 font-medium">Instant A* Detour Avoidance</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Emergency Journey Travel Time Benchmark (Minutes)
            </h3>
          </div>
          <p className="text-xs text-slate-400">Comparing standard uncoordinated traffic (Red) against AEGIS Green Corridor (Green).</p>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="trip" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="withoutCorridor" name="Without Corridor (min)" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="withCorridor" name="With Green Corridor (min)" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-teal-400" />
              Cumulative Time Saved (Minutes)
            </h3>
          </div>
          <p className="text-xs text-slate-400">Total life-saving minutes saved across active emergency runs.</p>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={responseTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="trip" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="saved" name="Minutes Saved" stroke="#10B981" fillOpacity={1} fill="url(#colorSaved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
