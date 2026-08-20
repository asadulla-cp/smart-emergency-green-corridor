import React, { useState } from 'react';
import type { Hospital, IntersectionNode, EmergencyPriority, RoadEdge } from '../../types/emergency';
import { HospitalEngine } from '../../services/hospitalEngine';
import { X, Siren, ShieldAlert, Building2, Sparkles } from 'lucide-react';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: IntersectionNode[];
  edges: RoadEdge[];
  hospitals: Hospital[];
  onDispatchAmbulance: (dispatchData: {
    vehicleId: string;
    emergencyType: string;
    severity: EmergencyPriority;
    startNodeId: string;
    targetHospitalId: string;
    vehicleType: string;
  }) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  hospitals,
  onDispatchAmbulance
}) => {
  const [vehicleId, setVehicleId] = useState('AMB-104');
  const [emergencyType, setEmergencyType] = useState('Cardiac Emergency');
  const [severity, setSeverity] = useState<EmergencyPriority>('CRITICAL');
  const [startNodeId, setStartNodeId] = useState<string>(nodes[0]?.id || 'N1');
  const [targetHospitalId, setTargetHospitalId] = useState<string>(hospitals[0]?.id || 'H1');
  const vehicleType = 'Advanced Cardiac Care Unit';

  if (!isOpen) return null;

  const hospitalEngine = new HospitalEngine();
  const rankedHospitals = hospitalEngine.rankHospitals(hospitals, startNodeId, emergencyType, severity, nodes, edges);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDispatchAmbulance({
      vehicleId,
      emergencyType,
      severity,
      startNodeId,
      targetHospitalId,
      vehicleType
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Siren className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Emergency Dispatch & Routing</h2>
              <p className="text-xs text-slate-400">Configure Ambulance & Activate Green Corridor</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Emergency Category</label>
              <select
                value={emergencyType}
                onChange={e => setEmergencyType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500"
              >
                <option value="Cardiac Emergency">🫀 Cardiac Emergency</option>
                <option value="Severe Trauma">🩹 Severe Trauma</option>
                <option value="Acute Stroke">🧠 Acute Stroke</option>
                <option value="Respiratory Distress">🫁 Respiratory Failure</option>
                <option value="Pediatric Critical">👶 Pediatric Crisis</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Patient Severity</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as EmergencyPriority)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 font-bold"
              >
                <option value="CRITICAL" className="text-rose-400">🔴 CRITICAL (Level 1 Priority)</option>
                <option value="HIGH" className="text-orange-400">🟠 HIGH (Level 2 Priority)</option>
                <option value="MEDIUM" className="text-amber-400">🟡 MEDIUM (Level 3 Priority)</option>
                <option value="LOW" className="text-emerald-400">🟢 LOW (Level 4 Priority)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Vehicle Identifier</label>
              <input
                type="text"
                value={vehicleId}
                onChange={e => setVehicleId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Pickup Location Node</label>
              <select
                value={startNodeId}
                onChange={e => setStartNodeId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500"
              >
                {nodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.name} (Intersection {n.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Destination Hospital Selection</span>
              </label>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> System Recommended
              </span>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {rankedHospitals.map(rec => (
                <div
                  key={rec.hospital.id}
                  onClick={() => setTargetHospitalId(rec.hospital.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    targetHospitalId === rec.hospital.id
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <span>{rec.hospital.name}</span>
                      {rec.isBestMatch && (
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/30">
                          BEST MATCH
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      ETA: {rec.etaMin.toFixed(1)} min • {rec.distanceKm.toFixed(1)} km • {rec.hospital.icuBedsAvailable} ICU Beds
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 font-mono">{rec.score} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>CONFIRM DISPATCH & LOCK GREEN CORRIDOR</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
