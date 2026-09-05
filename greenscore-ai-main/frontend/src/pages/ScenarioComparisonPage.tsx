import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Coins, 
  TrendingUp, 
  Trees, 
  Trash2, 
  Car, 
  ArrowRight,
  ShieldAlert,
  Award
} from 'lucide-react';

interface ScenarioComparisonPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ScenarioComparisonPage: React.FC<ScenarioComparisonPageProps> = ({ onNavigate }) => {
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScenarios() {
      try {
        const res = await api.compareScenarios(
          { tree_plantation_count: 1500, solar_power_capacity_mw_delta: 2.0 }, // Scenario A
          { waste_collection_efficiency_pct_delta: 20, water_conservation_recycled_mld: 8.0 }, // Scenario B
          { ev_bus_addition_count: 25, traffic_reduction_pct: 15, tree_plantation_count: 500 } // Scenario C
        );
        setComparisonData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadScenarios();
  }, []);

  if (loading || !comparisonData) {
    return (
      <div className="flex items-center justify-center h-96 text-blue-400 text-sm">
        <div className="animate-spin mr-2 h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full" />
        Simulating and comparing multi-objective scenario trajectories...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="h-5 w-5 text-blue-400" />
            <h1 className="text-2xl font-black text-white">Multi-Scenario Strategic Comparison</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              TRADE-OFF MATRIX
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compare alternative intervention portfolios side-by-side on Cost, Environmental Yield, Green Score Delta, and Execution Risk.
          </p>
        </div>

        <button
          onClick={() => onNavigate('budget')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-emerald flex items-center space-x-1.5"
        >
          <Coins className="h-4 w-4" />
          <span>Allocate Winning Scenario</span>
        </button>
      </div>

      {/* AI Comparative Highlight Box */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 space-y-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <h3 className="font-bold text-white text-sm">AI Recommendation: {comparisonData.scenarios.find((s: any) => s.is_recommended)?.name}</h3>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-medium">
          {comparisonData.comparison_notes}
        </p>
      </div>

      {/* 3-Column Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {comparisonData.scenarios.map((sc: any) => {
          const res = sc.results;
          const isRec = sc.is_recommended;

          return (
            <div
              key={sc.scenario_id}
              className={`glass-panel p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-5 ${
                isRec ? 'border-emerald-500/60 bg-emerald-500/5 shadow-2xl shadow-emerald-950/40' : 'border-slate-800'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      Scenario {sc.scenario_id}
                    </span>
                    <h3 className="font-bold text-white text-base mt-2">{sc.name}</h3>
                  </div>

                  {isRec && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-glow-emerald flex items-center">
                      <Award className="h-3 w-3 mr-1" />
                      BEST VALUE
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  "{sc.highlight}"
                </p>

                {/* Score Delta Display */}
                <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Simulated Green Score</span>
                  <div className="flex items-baseline justify-center space-x-2 my-1">
                    <span className="text-xl font-bold text-slate-400">{res.base_green_score}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-3xl font-black text-emerald-400">{res.simulated_green_score}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-300">+{res.score_delta} pts Improvement</span>
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Capital Cost:</span>
                    <span className="font-black text-white font-mono">₹{res.estimated_implementation_cost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">AQI Improvement:</span>
                    <span className="font-bold text-amber-400">{res.aqi_delta} AQI pts</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">CO2 Abatement:</span>
                    <span className="font-bold text-cyan-300">-{res.projected_co2_reduction_tons} Tons / Yr</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Residents Benefited:</span>
                    <span className="font-bold text-slate-200">{res.population_impacted.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Simulation Confidence:</span>
                    <span className="font-bold text-purple-300">{res.confidence_pct}%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('budget')}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                  isRec
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-emerald'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                Select Scenario {sc.scenario_id}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
