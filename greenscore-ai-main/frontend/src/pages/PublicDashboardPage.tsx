import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Zone, SustainabilityScoreSummary } from '../types';
import { ScoreMeter } from '../components/cards/ScoreMeter';
import { KPICard } from '../components/cards/KPICard';
import { 
  Globe, 
  Wind, 
  Trash2, 
  Droplets, 
  Trees, 
  ShieldCheck, 
  AlertCircle, 
  MessageSquarePlus,
  ArrowRight,
  Info
} from 'lucide-react';

interface PublicDashboardPageProps {
  onNavigate: (page: string) => void;
}

export const PublicDashboardPage: React.FC<PublicDashboardPageProps> = ({ onNavigate }) => {
  const [summary, setSummary] = useState<SustainabilityScoreSummary | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumRes, zonesRes] = await Promise.all([
          api.getCityScoreSummary(),
          api.getZones()
        ]);
        setSummary(sumRes);
        setZones(zonesRes);
        if (zonesRes.length > 0) setSelectedZone(zonesRes[0]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-emerald-400 text-sm">
        <div className="animate-spin mr-2 h-5 w-5 border-2 border-emerald-400 border-t-transparent rounded-full" />
        Loading public sustainability telemetry...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">Lucknow Public Sustainability Portal</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official citizen-facing environmental score, air quality index, and community health advisories.
          </p>
        </div>

        <button
          onClick={() => onNavigate('citizen-report')}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-emerald flex items-center space-x-2 self-start md:self-auto"
        >
          <MessageSquarePlus className="h-4 w-4" />
          <span>Report Environmental Issue</span>
        </button>
      </div>

      {/* Top Banner: Overall Score & Health Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-[#1F293D] flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            City Sustainability Score
          </p>
          <ScoreMeter score={summary?.overall_score || 72} tier={summary?.tier || 'Good'} size="lg" />
          <p className="text-xs text-slate-400 mt-2">
            Lucknow is currently performing in the <strong className="text-emerald-400">{summary?.tier || 'Good'}</strong> tier (+4.8% vs last month).
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[#1F293D] lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Public Health Advisory</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Air Quality is currently in the <strong>Moderate</strong> range (AQI 118). Sensitive individuals, elderly citizens, and children are advised to avoid prolonged heavy exertion outdoors during evening peak hours in the Chowk and Hazratganj corridors.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">AQI</span>
                <p className="text-lg font-bold text-amber-400">118</p>
                <span className="text-[10px] text-slate-400">Moderate</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Waste Efficiency</span>
                <p className="text-lg font-bold text-emerald-400">68%</p>
                <span className="text-[10px] text-slate-400">Doorstep Covered</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Water Quality</span>
                <p className="text-lg font-bold text-cyan-400">74%</p>
                <span className="text-[10px] text-slate-400">Potable Tested</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Green Cover</span>
                <p className="text-lg font-bold text-emerald-400">31%</p>
                <span className="text-[10px] text-slate-400">Urban Canopy</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800 mt-4">
            <span className="flex items-center"><Info className="h-3.5 w-3.5 mr-1" /> Data Sources: OpenAQ Sensor Network & LMC Telemetry</span>
            <span className="font-mono text-[11px]">Updated 15 mins ago</span>
          </div>
        </div>
      </div>

      {/* Zone-Wise Public Report Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-lg">Area-Wise Sustainability Breakdown</h3>
          <span className="text-xs text-slate-400">6 Monitored Municipal Zones</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((z) => (
            <div
              key={z.id}
              onClick={() => setSelectedZone(z)}
              className={`glass-panel glass-panel-hover p-4 rounded-xl border cursor-pointer transition-all ${
                selectedZone?.id === z.id ? 'border-emerald-500/60 bg-emerald-500/5' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-white text-sm">{z.name}</h4>
                  <p className="text-[11px] text-slate-400">Pop: {z.population.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-black ${
                    z.current_green_score >= 80 ? 'text-emerald-400' : (z.current_green_score >= 60 ? 'text-blue-400' : (z.current_green_score >= 40 ? 'text-amber-400' : 'text-red-400'))
                  }`}>
                    {z.current_green_score}
                  </span>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Score</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-slate-950/60 rounded-lg border border-slate-800/80 mb-3">
                <div>
                  <span className="text-[10px] text-slate-400">AQI</span>
                  <p className={`font-bold ${z.aqi > 150 ? 'text-red-400' : 'text-amber-400'}`}>{z.aqi}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Waste</span>
                  <p className="font-bold text-slate-200">{z.waste_efficiency}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Canopy</span>
                  <p className="font-bold text-slate-200">{z.green_cover_pct}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  z.risk_level === 'Critical' ? 'bg-red-500/20 text-red-400' : (z.risk_level === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400')
                }`}>
                  {z.risk_level} Risk Tier
                </span>
                <span className="text-slate-400">{z.open_issues_count} Active Reports</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
