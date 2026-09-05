import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BudgetOptimizationResponse } from '../types';
import { BudgetAllocationChart } from '../components/charts/BudgetAllocationChart';
import { 
  Coins, 
  Sparkles, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Building2, 
  ArrowRight,
  Info,
  Loader2,
  Award
} from 'lucide-react';

interface BudgetOptimizerPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const BudgetOptimizerPage: React.FC<BudgetOptimizerPageProps> = ({ onNavigate }) => {
  const [budgetInput, setBudgetInput] = useState<number>(1000000); // ₹10 Lakhs default
  const [riskAppetite, setRiskAppetite] = useState<string>('BALANCED');
  const [result, setResult] = useState<BudgetOptimizationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const runOptimization = async (customBudget?: number, customRisk?: string) => {
    const b = customBudget !== undefined ? customBudget : budgetInput;
    const r = customRisk || riskAppetite;
    if (b <= 0) return;

    setLoading(true);
    try {
      const res = await api.optimizeBudget(b, r);
      setResult(res);
    } catch (e: any) {
      alert(`Optimization error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runOptimization(1000000, 'BALANCED');
  }, []);

  const presets = [
    { label: '₹5 Lakhs', val: 500000 },
    { label: '₹10 Lakhs (Demo)', val: 1000000 },
    { label: '₹25 Lakhs', val: 2500000 },
    { label: '₹50 Lakhs', val: 5000000 }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">Smart Municipal Budget Optimizer</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              0/1 Knapsack & MCDA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Answers: <em>"What can we achieve with a fixed municipal budget?"</em> Maximizes combined environmental impact, population benefit, and execution feasibility under strict fiscal constraints.
          </p>
        </div>

        <button
          onClick={() => onNavigate('simulation')}
          className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <span>What-If Simulator</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Interactive Budget Control Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Budget Input & Presets */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                Enter Available Municipal Capital (₹ INR)
              </label>
              <span className="text-xl font-black text-emerald-400 font-mono">
                ₹{budgetInput.toLocaleString()}
              </span>
            </div>

            <input
              type="range"
              min="100000"
              max="5000000"
              step="50000"
              value={budgetInput}
              onChange={(e) => setBudgetInput(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-900 rounded-lg"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {presets.map((p) => (
                <button
                  key={p.val}
                  onClick={() => {
                    setBudgetInput(p.val);
                    runOptimization(p.val);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    budgetInput === p.val
                      ? 'bg-emerald-500 text-white shadow-glow-emerald'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Appetite & Optimize Button */}
          <div className="space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                Strategy & Risk Appetite
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setRiskAppetite(mode);
                      runOptimization(undefined, mode);
                    }}
                    className={`py-1 rounded-lg text-[10px] font-bold transition-all uppercase ${
                      riskAppetite === mode
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode.slice(0, 4)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => runOptimization()}
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-glow-emerald flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Computing Optimal Knapsack...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Run Multi-Objective Optimizer</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Optimization Results View */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top 4 Impact KPI Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Capital Allocated</span>
              <p className="text-xl lg:text-2xl font-black text-emerald-400 mt-1">
                ₹{result.total_allocated.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-400">{result.allocation_efficiency_pct}% Budget Utilized</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Aggregate Score Gain</span>
              <p className="text-xl lg:text-2xl font-black text-emerald-300 mt-1">
                +{result.expected_total_score_gain} pts
              </p>
              <span className="text-[11px] text-slate-400">Green Score Realization</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Citizens Directly Impacted</span>
              <p className="text-xl lg:text-2xl font-black text-blue-400 mt-1">
                {result.total_population_benefited.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-400">Residents Benefited</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Selected Interventions</span>
              <p className="text-xl lg:text-2xl font-black text-purple-400 mt-1">
                {result.allocations.length} Projects
              </p>
              <span className="text-[11px] text-slate-400">High-ROI Actions</span>
            </div>
          </div>

          {/* Explainable Rationale Summary */}
          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                Why this allocation? (Explainable AI Rationale)
              </h3>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {result.explainable_summary}
            </p>
          </div>

          {/* Chart & Recommended Portfolio Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Department Breakdown Chart */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">Department Budget Distribution</h3>
                <span className="text-[10px] text-slate-400">Expenditure (₹)</span>
              </div>
              <BudgetAllocationChart allocations={result.allocations} />
            </div>

            {/* Individual Allocated Intervention Cards */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-white text-sm">Recommended Intervention Portfolio</h3>
                <span className="text-xs text-slate-400 font-mono">Sorted by ROI / Rupee</span>
              </div>

              <div className="space-y-3">
                {result.allocations.map((item, idx) => (
                  <div
                    key={idx}
                    className="glass-panel p-4 rounded-xl border border-slate-800/90 hover:border-emerald-500/40 transition-all space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          {item.department_name} • {item.zone_name}
                        </span>
                        <h4 className="font-bold text-white text-sm mt-1.5">{item.title}</h4>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-black text-emerald-400 font-mono">
                          ₹{item.cost.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-emerald-300 block font-bold">
                          +{item.expected_score_gain} pts Score
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 text-center">
                      <div>
                        <span className="text-[10px] text-slate-400">Duration</span>
                        <p className="font-bold text-slate-200">{item.implementation_days} Days</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">Feasibility</span>
                        <p className="font-bold text-blue-300">{item.feasibility_pct}%</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">Population</span>
                        <p className="font-bold text-slate-200">{item.population_benefited.toLocaleString()}</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 italic pt-1">
                      {item.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
