import React, { useState } from 'react';
import { 
  Shield, 
  TrendingUp, 
  Coins, 
  Cpu, 
  Award, 
  Map, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquarePlus, 
  ChevronRight,
  Globe,
  Wind,
  Building2,
  Users
} from 'lucide-react';
import { ScoreMeter } from '../components/cards/ScoreMeter';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [calcBudget, setCalcBudget] = useState(1000000);

  const workflowSteps = [
    { num: '01', title: 'MONITOR', desc: 'Real-time urban sensor feeds across Air, Waste, Water & Mobility.' },
    { num: '02', title: 'PREDICT', desc: 'Scikit-Learn ML models forecasting 7-day & 30-day deterioration.' },
    { num: '03', title: 'PRIORITIZE', desc: 'MCDA ranking algorithm evaluating severity, population & risk.' },
    { num: '04', title: 'OPTIMIZE', desc: '0/1 Knapsack engine allocating limited municipal budget for max impact.' },
    { num: '05', title: 'SIMULATE', desc: 'What-If scenario modeling before executing costly interventions.' },
    { num: '06', title: 'ACT', desc: 'Department execution with progress tracking & evidence verification.' },
    { num: '07', title: 'MEASURE', desc: 'Objective pre-vs-post metric audit & automated Green Score updates.' }
  ];

  const features = [
    {
      title: 'AI Prediction & Forecasting',
      desc: 'Anticipate environmental deterioration 30 days before public health risks escalate.',
      icon: TrendingUp,
      page: 'predictions'
    },
    {
      title: 'Smart Budget Optimizer',
      desc: 'Maximized return on municipal expenditure through multi-objective Knapsack modeling.',
      icon: Coins,
      page: 'budget'
    },
    {
      title: 'What-If Simulation Sandbox',
      desc: 'Simulate the environmental outcome of tree planting, EV fleets, and waste reforms before spending.',
      icon: Cpu,
      page: 'simulation'
    },
    {
      title: 'Multi-Domain Green Score',
      desc: 'Transparent 0-100 municipal sustainability scoring calculated directly from physical data.',
      icon: Award,
      page: 'sustainability-score'
    },
    {
      title: 'Urban Digital Twin Map',
      desc: 'Spatial visualization of zone health, sensor overlays, and citizen complaint clusters.',
      icon: Map,
      page: 'digital-twin'
    },
    {
      title: 'Closed-Loop Impact Verification',
      desc: 'Statistically verify whether completed municipal actions achieved their forecasted results.',
      icon: CheckCircle2,
      page: 'impact'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 px-4 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 shadow-glow-emerald">
          <Sparkles className="h-4 w-4" />
          <span>Team Orbit • Municipal Decision Support Cockpit</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          GREENScore <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">AI</span>
        </h1>

        <p className="text-xl sm:text-2xl font-bold text-emerald-300 tracking-wide mb-4">
          "From Prediction to Verified Action."
        </p>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
          An AI-powered municipal intelligence platform that predicts environmental risks, prioritizes problems, optimizes budgets, simulates interventions, and measures real-world impact.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm transition-all shadow-glow-emerald flex items-center space-x-2"
          >
            <span>Launch Command Center</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => onNavigate('public-dashboard')}
            className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl text-sm transition-all flex items-center space-x-2"
          >
            <Globe className="h-4 w-4 text-cyan-400" />
            <span>Explore Public City Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('citizen-report')}
            className="px-6 py-3.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold rounded-xl text-sm transition-all flex items-center space-x-2"
          >
            <MessageSquarePlus className="h-4 w-4 text-blue-400" />
            <span>Report Citizen Issue</span>
          </button>
        </div>
      </section>

      {/* Visual Workflow Pipeline Banner */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#1F293D] shadow-2xl relative overflow-hidden">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">The Closed-Loop Cycle</span>
            <h2 className="text-2xl font-black text-white mt-1">Prediction → Decision → Execution → Verification</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 relative z-10">
            {workflowSteps.map((step, idx) => (
              <div
                key={step.num}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:bg-slate-800/90"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {step.num}
                  </span>
                  <h4 className="font-extrabold text-white text-xs mt-2">{step.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Feature Cards */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Municipal Decision Support</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Comprehensive Command System</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                onClick={() => onNavigate(feat.page)}
                className="glass-panel glass-panel-hover p-6 rounded-2xl border border-slate-800 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 w-fit rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-glow-emerald">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>

                <div className="flex items-center text-xs font-bold text-emerald-400 mt-5 pt-3 border-t border-slate-800">
                  <span>Explore Feature</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Teaser Calculator */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#1F293D] shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 space-y-3">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Quick Municipal Simulator</span>
              <h3 className="text-xl font-bold text-white">What can Lucknow achieve with ₹{calcBudget.toLocaleString()}?</h3>
              <p className="text-xs text-slate-400">
                Adjust available capital to test the 0/1 Knapsack Multi-Objective allocation engine.
              </p>

              <div className="pt-2">
                <input
                  type="range"
                  min="200000"
                  max="2500000"
                  step="100000"
                  value={calcBudget}
                  onChange={(e) => setCalcBudget(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>₹2 Lakhs</span>
                  <span>₹10 Lakhs</span>
                  <span>₹25 Lakhs</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 min-w-[240px] text-center space-y-2">
              <p className="text-xs text-slate-400">Projected Outcome</p>
              <p className="text-3xl font-black text-emerald-400">
                +{(calcBudget / 100000 * 1.15).toFixed(1)} pts
              </p>
              <p className="text-[11px] text-slate-400">Aggregate Green Score Gain</p>
              <button
                onClick={() => onNavigate('budget')}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all mt-2"
              >
                Run Full Optimization
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
