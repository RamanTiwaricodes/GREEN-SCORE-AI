import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Zone, Problem, ActionAssignment, Alert } from '../types';
import { KPICard } from '../components/cards/KPICard';
import { ScoreMeter } from '../components/cards/ScoreMeter';
import { WorkflowPipelineBar } from '../components/layout/WorkflowPipelineBar';
import { RadarHealthChart } from '../components/charts/RadarHealthChart';
import { DigitalTwinMap } from '../components/maps/DigitalTwinMap';
import {
  Shield,
  Wind,
  Trash2,
  Droplets,
  Trees,
  Zap,
  Car,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Coins,
  Bot,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenAssistant: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate, onOpenAssistant }) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [dashRes, zonesRes] = await Promise.all([
        api.getDashboardSummary(),
        api.getZones()
      ]);
      setDashboardData(dashRes);
      setZones(zonesRes);
      if (zonesRes.length > 0) setSelectedZone(zonesRes[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-96 text-emerald-400 text-sm">
        <div className="animate-spin mr-2 h-5 w-5 border-2 border-emerald-400 border-t-transparent rounded-full" />
        Initializing Municipal Command Center Telemetry...
      </div>
    );
  }

  const kpis = dashboardData.kpis;

  const radarData = [
    { domain: 'Air Quality', score: Math.round(100 - (kpis.aqi * 0.35)), benchmark: 80 },
    { domain: 'Waste Management', score: Math.round(kpis.waste_efficiency), benchmark: 85 },
    { domain: 'Water Health', score: Math.round(kpis.water_health), benchmark: 80 },
    { domain: 'Green Cover', score: Math.round((kpis.green_cover_pct / 33) * 90), benchmark: 90 },
    { domain: 'Energy Efficiency', score: Math.round(kpis.energy_efficiency), benchmark: 75 },
    { domain: 'Mobility & EV', score: Math.round(kpis.mobility_score), benchmark: 70 }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white">Lucknow Municipal Command Cockpit</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time urban intelligence, risk forecasting, and automated decision-support pipeline.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadData}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 text-xs font-bold transition-all flex items-center space-x-1.5"
            title="Refresh Telemetry"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={onOpenAssistant}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-emerald flex items-center space-x-2"
          >
            <Bot className="h-4 w-4 animate-bounce" />
            <span>AI Decision Assistant</span>
          </button>
        </div>
      </div>

      {/* Main Visual USP Workflow Bar */}
      <WorkflowPipelineBar currentStage="dashboard" onSelectStage={onNavigate} />

      {/* Top Level 8 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <KPICard
          title="Green Score"
          value={kpis.overall_green_score}
          unit="/100"
          delta={kpis.score_delta_pct}
          icon={Shield}
          color="emerald"
          badgeType="DEMO"
          onClick={() => onNavigate('sustainability-score')}
        />

        <KPICard
          title="Air Quality"
          value={kpis.aqi}
          unit="AQI"
          subtitle={kpis.aqi_category}
          icon={Wind}
          color="amber"
          badgeType="LIVE"
          onClick={() => onNavigate('environmental-intel')}
        />

        <KPICard
          title="Waste Eff."
          value={`${kpis.waste_efficiency}%`}
          subtitle="Doorstep Collection"
          icon={Trash2}
          color="emerald"
          badgeType="DEMO"
          onClick={() => onNavigate('environmental-intel')}
        />

        <KPICard
          title="Water Health"
          value={`${kpis.water_health}%`}
          subtitle="Potable Tested"
          icon={Droplets}
          color="blue"
          badgeType="DEMO"
          onClick={() => onNavigate('environmental-intel')}
        />

        <KPICard
          title="Green Cover"
          value={`${kpis.green_cover_pct}%`}
          subtitle="Canopy Index"
          icon={Trees}
          color="emerald"
          badgeType="DEMO"
          onClick={() => onNavigate('environmental-intel')}
        />

        <KPICard
          title="Energy Eff."
          value={`${kpis.energy_efficiency}%`}
          subtitle="Grid Index"
          icon={Zap}
          color="purple"
          badgeType="DEMO"
          onClick={() => onNavigate('environmental-intel')}
        />

        <KPICard
          title="Mobility"
          value={`${kpis.mobility_score}%`}
          subtitle="Traffic Flow"
          icon={Car}
          color="blue"
          badgeType="DEMO"
          onClick={() => onNavigate('environmental-intel')}
        />

        <KPICard
          title="Open Risks"
          value={kpis.open_issues_count}
          subtitle="Ranked Issues"
          icon={AlertTriangle}
          color="red"
          badgeType="DEMO"
          onClick={() => onNavigate('priority')}
        />
      </div>

      {/* Main Cockpit Section: Digital Twin Map + Multi-Domain Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Digital Twin Map */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-white text-base flex items-center">
              <span>Digital Twin City Visualization</span>
              <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Spatial Hotspots
              </span>
            </h3>
            <button
              onClick={() => onNavigate('digital-twin')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center"
            >
              <span>Full Screen Twin</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </button>
          </div>

          <DigitalTwinMap
            zones={zones}
            selectedZone={selectedZone}
            onSelectZone={(z) => setSelectedZone(z)}
            onNavigateToSimulator={(zid) => onNavigate('simulation', { zoneId: zid })}
            onNavigateToExplorer={(zid) => onNavigate('zones', { zoneId: zid })}
          />
        </div>

        {/* Right Column: Multi-Domain Radar & Quick Gauge */}
        <div className="glass-panel p-5 rounded-2xl border border-[#1F293D] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-white text-sm">City Health Multi-Domain Radar</h3>
              <span className="text-[10px] text-slate-400">CPCB Standards</span>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Composite urban diagnostic comparing current subscores against sustainability targets.
            </p>
            <RadarHealthChart data={radarData} />
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold">Recommended Immediate Action</p>
              <p className="font-bold text-emerald-400 mt-0.5">Deploy Smart Bins in Chowk Market</p>
            </div>
            <button
              onClick={() => onNavigate('budget')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow-glow-emerald"
            >
              Allocate ₹
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Section: Top Ranked Problems & Active Municipal Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top 3 Prioritized Problems */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
              <h3 className="font-bold text-white text-base">Top Ranked Problems (MCDA)</h3>
            </div>
            <button
              onClick={() => onNavigate('priority')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center"
            >
              <span>View All ({dashboardData.top_problems?.length || 0})</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {dashboardData.top_problems?.map((p: Problem) => (
              <div
                key={p.id}
                onClick={() => onNavigate('recommendations', { problemId: p.id })}
                className="bg-slate-900/80 hover:bg-slate-800/80 p-3.5 rounded-xl border border-slate-800/90 cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="h-5 w-5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold text-xs">
                      #{p.priority_rank}
                    </span>
                    <h4 className="font-bold text-white text-xs leading-tight">{p.title}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400">
                    {p.severity}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Exposure: <strong className="text-slate-200">{p.affected_population.toLocaleString()} Residents</strong></span>
                  <span className="font-bold text-amber-400">Score: {p.priority_score} pts</span>
                </div>

                <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                  "{p.why_priority_reason}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Department Actions in Flight */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <h3 className="font-bold text-white text-base">Department Actions in Execution</h3>
            </div>
            <button
              onClick={() => onNavigate('actions')}
              className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center"
            >
              <span>Manage Pipeline</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {dashboardData.active_actions?.map((act: ActionAssignment) => (
              <div
                key={act.id}
                onClick={() => onNavigate('actions')}
                className="bg-slate-900/80 hover:bg-slate-800/80 p-3.5 rounded-xl border border-slate-800/90 cursor-pointer transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 font-bold">
                      {act.action_code}
                    </span>
                    <h4 className="font-bold text-white text-xs mt-1">{act.title}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    act.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {act.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Department Progress:</span>
                    <span className="font-bold text-white">{act.progress_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${act.progress_pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Dept: <strong className="text-slate-300">{act.department_name}</strong></span>
                  <span>Est: <strong className="text-slate-300">₹{(act.estimated_cost / 100000).toFixed(1)}L</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
