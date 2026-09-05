import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ScoreWeights, Zone, SustainabilityScoreSummary } from '../types';
import { ScoreMeter } from '../components/cards/ScoreMeter';
import { 
  BarChart3, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Shield, 
  Wind, 
  Trash2, 
  Droplets, 
  Trees, 
  Zap, 
  Car, 
  Users,
  Info
} from 'lucide-react';

interface SustainabilityScorePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const SustainabilityScorePage: React.FC<SustainabilityScorePageProps> = ({ onNavigate }) => {
  const [summary, setSummary] = useState<SustainabilityScoreSummary | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [weights, setWeights] = useState<ScoreWeights>({
    air: 0.20,
    waste: 0.20,
    water: 0.15,
    green: 0.15,
    energy: 0.10,
    mobility: 0.10,
    citizen: 0.10
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [sumRes, zList, wRes] = await Promise.all([
        api.getCityScoreSummary(),
        api.getZones(),
        api.getWeights()
      ]);
      setSummary(sumRes);
      setZones(zList);
      if (wRes) setWeights(wRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRecalculate = async () => {
    setSaving(true);
    try {
      await api.recalculateScores(weights);
      await loadData();
      alert('Green Score Category Weights updated and city-wide scores recalculated successfully!');
    } catch (e: any) {
      alert(`Error updating weights: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleResetWeights = () => {
    setWeights({
      air: 0.20,
      waste: 0.20,
      water: 0.15,
      green: 0.15,
      energy: 0.10,
      mobility: 0.10,
      citizen: 0.10
    });
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">Green Score Calculation Engine</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              CONFIGURABLE WEIGHTS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standardized 0-100 municipal sustainability score calculated deterministically from physical telemetry and citizen grievance density.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetWeights}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 text-xs font-bold transition-all"
          >
            Reset Defaults
          </button>
          <button
            onClick={handleRecalculate}
            disabled={saving}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-emerald flex items-center space-x-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${saving ? 'animate-spin' : ''}`} />
            <span>Recalculate City Scores</span>
          </button>
        </div>
      </div>

      {/* Top Banner: City Score + Weight Configuration Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* City Gauge */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Municipal Green Score</p>
          <ScoreMeter score={summary?.overall_score || 72} tier={summary?.tier || 'Good'} size="lg" />
          <div className="text-xs text-slate-300 space-y-1">
            <p>Score Formula: <strong className="font-mono text-emerald-400">Score = Σ (w_i × Subscore_i)</strong></p>
            <p className="text-[11px] text-slate-400">Sum of weights: <strong className={Math.abs(totalWeight - 1.0) < 0.01 ? 'text-emerald-400' : 'text-amber-400'}>{(totalWeight * 100).toFixed(0)}%</strong></p>
          </div>
        </div>

        {/* Configurable Weight Sliders (Admin RBAC) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base flex items-center">
              <Sliders className="h-4 w-4 mr-2 text-emerald-400" />
              Category Weights Customizer (Admin Only)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Dynamic Policy Configuration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Air Quality */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold flex items-center"><Wind className="h-3.5 w-3.5 mr-1 text-blue-400" /> Air Quality</span>
                <span className="font-mono font-bold text-emerald-400">{Math.round(weights.air * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.40"
                step="0.05"
                value={weights.air}
                onChange={(e) => setWeights({ ...weights, air: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Waste Management */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold flex items-center"><Trash2 className="h-3.5 w-3.5 mr-1 text-orange-400" /> Waste Management</span>
                <span className="font-mono font-bold text-emerald-400">{Math.round(weights.waste * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.40"
                step="0.05"
                value={weights.waste}
                onChange={(e) => setWeights({ ...weights, waste: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Water Health */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold flex items-center"><Droplets className="h-3.5 w-3.5 mr-1 text-cyan-400" /> Water Health</span>
                <span className="font-mono font-bold text-emerald-400">{Math.round(weights.water * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.30"
                step="0.05"
                value={weights.water}
                onChange={(e) => setWeights({ ...weights, water: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Green Cover */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold flex items-center"><Trees className="h-3.5 w-3.5 mr-1 text-emerald-400" /> Green Cover</span>
                <span className="font-mono font-bold text-emerald-400">{Math.round(weights.green * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.30"
                step="0.05"
                value={weights.green}
                onChange={(e) => setWeights({ ...weights, green: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Energy */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold flex items-center"><Zap className="h-3.5 w-3.5 mr-1 text-yellow-400" /> Energy Efficiency</span>
                <span className="font-mono font-bold text-emerald-400">{Math.round(weights.energy * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.25"
                step="0.05"
                value={weights.energy}
                onChange={(e) => setWeights({ ...weights, energy: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Mobility */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold flex items-center"><Car className="h-3.5 w-3.5 mr-1 text-purple-400" /> Mobility & EV</span>
                <span className="font-mono font-bold text-emerald-400">{Math.round(weights.mobility * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.25"
                step="0.05"
                value={weights.mobility}
                onChange={(e) => setWeights({ ...weights, mobility: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

          </div>

          <p className="text-[11px] text-slate-400 italic">
            Weights are automatically normalized to 100% on calculation. Adjusting weights updates scores across all 6 zones in the PostgreSQL / SQLite database.
          </p>
        </div>

      </div>

      {/* Zone Score Cards Matrix */}
      <div className="space-y-4">
        <h3 className="font-bold text-white text-base">Zone Sustainability Score Breakdown</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((z) => (
            <div key={z.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white text-base">{z.name}</h4>
                  <p className="text-xs text-slate-400">Pop: {z.population.toLocaleString()}</p>
                </div>

                <div className="text-right">
                  <span className={`text-2xl font-black ${
                    z.current_green_score >= 80 ? 'text-emerald-400' : (z.current_green_score >= 60 ? 'text-blue-400' : (z.current_green_score >= 40 ? 'text-amber-400' : 'text-red-400'))
                  }`}>
                    {z.current_green_score}
                  </span>
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Score</span>
                </div>
              </div>

              {/* Subscores mini grid */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Air Quality Subscore:</span>
                  <span className="font-bold">{Math.round(100 - (z.aqi * 0.35))} / 100</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Waste Collection Subscore:</span>
                  <span className="font-bold">{z.waste_efficiency} / 100</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Water Health Subscore:</span>
                  <span className="font-bold">{z.water_score} / 100</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Green Canopy Subscore:</span>
                  <span className="font-bold">{Math.round((z.green_cover_pct / 33) * 90)} / 100</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  z.risk_level === 'Critical' ? 'bg-red-500/20 text-red-400' : (z.risk_level === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400')
                }`}>
                  {z.risk_level} Tier
                </span>
                <button
                  onClick={() => onNavigate('zones', { zoneId: z.id })}
                  className="text-emerald-400 font-bold hover:underline"
                >
                  Explore Zone →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
