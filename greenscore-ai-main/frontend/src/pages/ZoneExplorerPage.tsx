import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Zone, Problem, ActionAssignment } from '../types';
import { ScoreMeter } from '../components/cards/ScoreMeter';
import { 
  MapPin, 
  Wind, 
  Trash2, 
  Droplets, 
  Trees, 
  Zap, 
  Car, 
  AlertTriangle, 
  TrendingUp, 
  CheckSquare, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ZoneExplorerPageProps {
  initialZoneId?: number;
  onNavigate: (page: string, params?: any) => void;
}

export const ZoneExplorerPage: React.FC<ZoneExplorerPageProps> = ({ initialZoneId, onNavigate }) => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<number>(initialZoneId || 5); // Chowk default
  const [zoneDetails, setZoneDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadZones() {
      try {
        const res = await api.getZones();
        setZones(res);
      } catch (e) {
        console.error(e);
      }
    }
    loadZones();
  }, []);

  useEffect(() => {
    async function loadDetails() {
      if (!selectedZoneId) return;
      setLoading(true);
      try {
        const res = await api.getZoneDetails(selectedZoneId);
        setZoneDetails(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [selectedZoneId]);

  const activeZone = zoneDetails?.zone || zones.find((z) => z.id === selectedZoneId);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">Zone Deep-Dive & Diagnostic Explorer</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Detailed zone-specific telemetry, demographic exposure, active risks, and intervention progress.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedZoneId}
            onChange={(e) => setSelectedZoneId(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
          >
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} (Score: {z.current_green_score})
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeZone && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top Zone Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="flex flex-col items-center justify-center text-center">
              <ScoreMeter score={activeZone.current_green_score} tier={activeZone.risk_level === 'Low' ? 'Excellent' : (activeZone.risk_level === 'Moderate' ? 'Good' : 'Critical')} size="lg" />
            </div>

            <div className="lg:col-span-2 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-white">{activeZone.name}</h2>
                  <p className="text-xs text-slate-400">
                    Jurisdiction: Lucknow Municipal Corporation • Area: {activeZone.area_sqkm} km²
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                  activeZone.risk_level === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : (activeZone.risk_level === 'High' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40')
                }`}>
                  {activeZone.risk_level} Risk Tier
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Affected Population</span>
                  <p className="font-bold text-white mt-0.5">{activeZone.population.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Air Quality</span>
                  <p className={`font-bold mt-0.5 ${activeZone.aqi > 150 ? 'text-red-400' : 'text-amber-400'}`}>{activeZone.aqi} AQI</p>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Waste Collection</span>
                  <p className="font-bold text-slate-200 mt-0.5">{activeZone.waste_efficiency}%</p>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">30d Forecast</span>
                  <p className="font-bold text-purple-300 mt-0.5">{activeZone.predicted_green_score} pts</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => onNavigate('simulation', { zoneId: activeZone.id })}
                  className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-bold transition-all"
                >
                  Run What-If Simulation for {activeZone.name}
                </button>
                <button
                  onClick={() => onNavigate('predictions')}
                  className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-bold transition-all"
                >
                  View ML Predictions
                </button>
              </div>
            </div>
          </div>

          {/* Active Problems & Actions in this Zone */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Active Problems */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-white text-base">Active Environmental Risks ({zoneDetails?.problems?.length || 0})</h3>
                <span className="text-xs text-red-400 font-bold">Prioritized</span>
              </div>

              <div className="space-y-2.5">
                {zoneDetails?.problems?.map((p: Problem) => (
                  <div key={p.id} className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex justify-between">
                      <h4 className="font-bold text-white text-xs leading-tight">{p.title}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400">{p.severity}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 italic">{p.why_priority_reason}</p>
                  </div>
                ))}

                {(!zoneDetails?.problems || zoneDetails.problems.length === 0) && (
                  <p className="text-xs text-slate-500 py-4 text-center">No active critical problems reported in this zone.</p>
                )}
              </div>
            </div>

            {/* Active Actions */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-white text-base">Municipal Interventions in Flight</h3>
                <span className="text-xs text-emerald-400 font-bold">Execution</span>
              </div>

              <div className="space-y-2.5">
                {zoneDetails?.actions?.map((act: ActionAssignment) => (
                  <div key={act.id} className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between">
                      <h4 className="font-bold text-white text-xs leading-tight">{act.title}</h4>
                      <span className="text-xs font-bold text-emerald-400">{act.progress_pct}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${act.progress_pct}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Status: {act.status}</span>
                      <span>Cost: ₹{(act.estimated_cost / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                ))}

                {(!zoneDetails?.actions || zoneDetails.actions.length === 0) && (
                  <p className="text-xs text-slate-500 py-4 text-center">No actions currently assigned to this zone.</p>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
