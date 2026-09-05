import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Zone } from '../types';
import { ScoreMeter } from '../components/cards/ScoreMeter';
import { 
  Globe, 
  MapPin, 
  TrendingUp, 
  Wind, 
  Trash2, 
  Droplets, 
  Trees, 
  ShieldAlert, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface CityOverviewPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CityOverviewPage: React.FC<CityOverviewPageProps> = ({ onNavigate }) => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getZones();
        setZones(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalPop = zones.reduce((a, b) => a + b.population, 0);
  const avgScore = zones.length > 0 ? (zones.reduce((a, b) => a + b.current_green_score, 0) / zones.length).toFixed(1) : '72.0';

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">City Spatial & Demographic Overview</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              LUCKNOW METRO
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated territorial performance, demographics exposure, and sustainability disparity across municipal wards.
          </p>
        </div>

        <button
          onClick={() => onNavigate('digital-twin')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-emerald flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <span>Open Digital Twin GIS</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Aggregate City Stat Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Monitored Catchment</span>
          <p className="text-xl font-black text-white mt-1">{totalPop.toLocaleString()} Residents</p>
          <span className="text-[11px] text-slate-400">6 Key Administrative Zones</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Municipal Mean Green Score</span>
          <p className="text-xl font-black text-emerald-400 mt-1">{avgScore} / 100</p>
          <span className="text-[11px] text-emerald-300">+4.8% Monthly Growth</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Top Performing Ward</span>
          <p className="text-xl font-black text-emerald-300 mt-1">Gomti Nagar</p>
          <span className="text-[11px] text-slate-400">Score 82.0 (Excellent)</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Primary Risk Ward</span>
          <p className="text-xl font-black text-red-400 mt-1">Chowk</p>
          <span className="text-[11px] text-red-300">Score 54.0 (Critical Tier)</span>
        </div>
      </div>

      {/* Zone Cards Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-white text-base">Comprehensive Zone Diagnostics</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {zones.map((z) => (
            <div
              key={z.id}
              className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-lg">{z.name}</h4>
                    <p className="text-xs text-slate-400">Area: {z.area_sqkm} km² • Pop: {z.population.toLocaleString()}</p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                    z.risk_level === 'Critical' ? 'bg-red-500/20 text-red-400' : (z.risk_level === 'High' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-400')
                  }`}>
                    {z.risk_level} Risk
                  </span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 my-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Current Green Score</span>
                    <p className="text-2xl font-black text-emerald-400">{z.current_green_score}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">30d Forecast</span>
                    <p className="text-xl font-bold text-purple-300">{z.predicted_green_score} pts</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">AQI:</span>
                    <strong className={z.aqi > 150 ? 'text-red-400' : 'text-amber-400'}>{z.aqi}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Waste:</span>
                    <strong>{z.waste_efficiency}%</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Water:</span>
                    <strong>{z.water_score}%</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Canopy:</span>
                    <strong>{z.green_cover_pct}%</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('simulation', { zoneId: z.id })}
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold"
                >
                  Simulate Interventions
                </button>

                <button
                  onClick={() => onNavigate('zones', { zoneId: z.id })}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-glow-emerald"
                >
                  Zone Deep-Dive
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
