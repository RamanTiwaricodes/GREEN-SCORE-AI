import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Recommendation } from '../types';
import { 
  Sparkles, 
  Coins, 
  Clock, 
  Users, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';

interface RecommendationsPageProps {
  initialProblemId?: number;
  onNavigate: (page: string, params?: any) => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ initialProblemId, onNavigate }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.getRecommendations(initialProblemId);
      setRecommendations(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [initialProblemId]);

  const handleApprove = async (id: number) => {
    try {
      await api.approveRecommendation(id);
      await loadData();
    } catch (e: any) {
      alert(`Error approving recommendation: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">AI Prescriptive Recommendations</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              DECISION SUPPORT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Data-backed interventions with estimated cost (₹), expected Green Score gain, implementation timeline, and department routing.
          </p>
        </div>

        <button
          onClick={() => onNavigate('budget')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-emerald flex items-center space-x-1.5"
        >
          <Coins className="h-4 w-4" />
          <span>Launch Budget Optimizer</span>
        </button>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {recommendations.map((rec) => {
          const isApproved = rec.status === 'APPROVED';

          return (
            <div
              key={rec.id}
              className={`glass-panel glass-panel-hover p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isApproved ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {rec.zone_name} • {rec.department_name}
                    </span>
                    <h3 className="font-extrabold text-white text-base mt-2 leading-snug">{rec.title}</h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold shrink-0 ${
                    isApproved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {rec.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>

                {/* Key Metric Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400">Est. Cost</span>
                    <p className="font-black text-emerald-400 mt-0.5">₹{(rec.estimated_cost / 100000).toFixed(1)}L</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Score Gain</span>
                    <p className="font-black text-emerald-300 mt-0.5">+{rec.expected_score_gain} pts</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Duration</span>
                    <p className="font-bold text-slate-200 mt-0.5">{rec.implementation_days} Days</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Feasibility</span>
                    <p className="font-bold text-blue-300 mt-0.5">{rec.feasibility_pct}%</p>
                  </div>
                </div>

                {/* Environmental Benefit Banner */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Expected Environmental Return:</span>
                  <p className="font-semibold text-slate-200">{rec.expected_env_gain}</p>
                </div>

                {/* Explainable Reasoning */}
                <div className="bg-purple-500/10 border border-purple-500/20 p-2.5 rounded-xl text-[11px] text-purple-200">
                  <span className="font-bold block text-purple-300 mb-0.5">AI Rationale:</span>
                  {rec.explainable_reason}
                </div>
              </div>

              {/* Bottom Action Approval */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Benefiting <strong>{rec.population_benefited?.toLocaleString() || '20,000'}</strong> residents
                </span>

                <div className="flex items-center space-x-2">
                  {!isApproved ? (
                    <button
                      onClick={() => handleApprove(rec.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-emerald"
                    >
                      Approve Action
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('actions')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                    >
                      <span>Assign in Pipeline</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
