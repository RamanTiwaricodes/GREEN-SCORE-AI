import React from 'react';
import { 
  AlertCircle, 
  TrendingUp, 
  ListOrdered, 
  Coins, 
  Cpu, 
  CheckSquare, 
  Award,
  ChevronRight
} from 'lucide-react';

interface WorkflowPipelineBarProps {
  currentStage?: string;
  onSelectStage?: (stageKey: string) => void;
}

export const WorkflowPipelineBar: React.FC<WorkflowPipelineBarProps> = ({
  currentStage = 'dashboard',
  onSelectStage
}) => {
  const stages = [
    { key: 'problems', label: '1. Problem', icon: AlertCircle, desc: 'Detect Anomaly', page: 'problems' },
    { key: 'predictions', label: '2. Predict', icon: TrendingUp, desc: '30-Day Forecast', page: 'predictions' },
    { key: 'priority', label: '3. Prioritize', icon: ListOrdered, desc: 'MCDA Ranking', page: 'priority' },
    { key: 'budget', label: '4. Optimize', icon: Coins, desc: 'Smart Budget Portfolio', page: 'budget' },
    { key: 'simulation', label: '5. Simulate', icon: Cpu, desc: 'What-If Scenarios', page: 'simulation' },
    { key: 'actions', label: '6. Act', icon: CheckSquare, desc: 'Department Execution', page: 'actions' },
    { key: 'impact', label: '7. Measure', icon: Award, desc: 'Verified Impact Delta', page: 'impact' },
  ];

  return (
    <div className="w-full bg-[#0D1322] border border-[#1F293D] rounded-xl p-3 my-4 shadow-lg">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            End-to-End Decision & Action Pipeline
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
          Prediction → Prioritization → Budget Optimization → Simulation → Department Execution → Impact Verification
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {stages.map((st, idx) => {
          const Icon = st.icon;
          const isActive = currentStage === st.page;
          return (
            <button
              key={st.key}
              onClick={() => onSelectStage && onSelectStage(st.page)}
              className={`flex items-center space-x-2.5 p-2 rounded-lg border text-left transition-all ${
                isActive
                  ? 'bg-emerald-500/20 border-emerald-400/60 shadow-glow-emerald text-emerald-200'
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div
                className={`p-1.5 rounded-md ${
                  isActive ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate leading-tight">{st.label}</p>
                <p className="text-[10px] text-slate-400 truncate leading-tight">{st.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
