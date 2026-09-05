import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Problem, Zone } from '../types';
import { 
  ListOrdered, 
  Sparkles, 
  AlertTriangle, 
  Users, 
  TrendingDown, 
  Building2, 
  ArrowRight,
  Shield,
  Coins,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface PriorityEnginePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const PriorityEnginePage: React.FC<PriorityEnginePageProps> = ({ onNavigate }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  const loadData = async () => {
    try {
      const [probs, zList] = await Promise.all([
        api.getProblems(selectedZoneId),
        api.getZones()
      ]);
      setProblems(probs);
      setZones(zList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedZoneId]);

  const handleRePrioritize = async () => {
    setRecalculating(true);
    try {
      await api.prioritizeProblems(selectedZoneId);
      await loadData();
    } catch (e: any) {
      alert(`Prioritization error: ${e.message}`);
    } finally {
      setRecalculating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ListOrdered className="h-5 w-5 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">AI Multi-Criteria Priority Engine</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              MCDA RANKING
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Answers: <em>"Which problem should be solved first?"</em> Evaluates severity, affected population, predicted deterioration, and feasibility.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRePrioritize}
            disabled={recalculating}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${recalculating ? 'animate-spin' : ''}`} />
            <span>Recalculate Ranking</span>
          </button>

          <button
            onClick={() => onNavigate('budget')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-emerald flex items-center space-x-1.5"
          >
            <Coins className="h-4 w-4" />
            <span>Optimize Budget for Priorities</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Filter Zone:</span>
          <select
            value={selectedZoneId || ''}
            onChange={(e) => setSelectedZoneId(e.target.value ? Number(e.target.value) : undefined)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
          >
            <option value="">All Lucknow Zones ({problems.length} Problems)</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">
          Evaluation: Severity (30%) + Population (25%) + Deterioration (20%) + Urgency (15%) + Feasibility (10%)
        </span>
      </div>

      {/* Priority Ranked Cards */}
      <div className="space-y-4">
        {problems.map((prob) => (
          <div
            key={prob.id}
            className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 transition-all space-y-3 relative overflow-hidden"
          >
            {/* Rank Flag */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                <span className={`h-8 w-8 rounded-xl font-black text-sm flex items-center justify-center border shadow-md ${
                  prob.priority_rank === 1
                    ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-glow-red'
                    : prob.priority_rank === 2
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-glow-amber'
                    : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                }`}>
                  #{prob.priority_rank}
                </span>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-white text-base leading-tight">{prob.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {prob.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center mt-0.5">
                    <span>Zone: <strong className="text-slate-200">{prob.zone_name}</strong></span>
                    <span className="mx-2">•</span>
                    <span>Routing: <strong className="text-cyan-300">{prob.suggested_department_name}</strong></span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:text-right">
                <div>
                  <span className="text-xl font-black text-emerald-400">{prob.priority_score}</span>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">MCDA Index</span>
                </div>
                <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                  prob.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : (prob.severity === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-blue-500/20 text-blue-300 border border-blue-500/40')
                }`}>
                  {prob.severity}
                </span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Affected Population</span>
                <p className="font-bold text-slate-200 mt-0.5 flex items-center">
                  <Users className="h-3.5 w-3.5 mr-1 text-blue-400" />
                  {prob.affected_population.toLocaleString()} Residents
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Current Metric</span>
                <p className="font-bold text-amber-300 mt-0.5">{prob.current_metric_val}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Trend & Trajectory</span>
                <p className="font-bold text-red-400 mt-0.5 flex items-center">
                  <TrendingDown className="h-3.5 w-3.5 mr-1" />
                  {prob.trend}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">30d Deterioration</span>
                <p className="font-bold text-slate-300 mt-0.5 truncate">{prob.predicted_deterioration}</p>
              </div>
            </div>

            {/* "WHY THIS IS PRIORITY" Transparent Explainability Box */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-400 flex items-center">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Why this is Priority:
              </span>
              <p className="text-slate-200 leading-relaxed font-medium">
                {prob.why_priority_reason}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500 font-mono">
                Model Confidence: {prob.confidence_pct}% • Decision Support Only
              </span>

              <button
                onClick={() => onNavigate('recommendations', { problemId: prob.id })}
                className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
              >
                <span>View AI Recommendations</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
