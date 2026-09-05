import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  delta?: number;
  deltaLabel?: string;
  icon: LucideIcon;
  badgeType?: 'LIVE' | 'DEMO' | 'PREDICTED' | 'SIMULATED';
  color?: 'emerald' | 'blue' | 'amber' | 'red' | 'purple';
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  subtitle,
  delta,
  deltaLabel = 'vs last month',
  icon: Icon,
  badgeType = 'DEMO',
  color = 'emerald',
  onClick
}) => {
  const colorStyles = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  };

  const badgeStyles = {
    LIVE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse',
    DEMO: 'bg-slate-800 text-slate-400 border-slate-700',
    PREDICTED: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    SIMULATED: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel glass-panel-hover p-4 rounded-xl relative overflow-hidden transition-all ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-lg border ${colorStyles[color]}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
            {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
          </div>
        </div>

        {/* Origin Badge */}
        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${badgeStyles[badgeType]}`}>
          {badgeType}
        </span>
      </div>

      <div className="flex items-baseline space-x-1 mb-2">
        <span className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{value}</span>
        {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
      </div>

      {delta !== undefined && (
        <div className="flex items-center space-x-1.5 text-xs">
          {delta > 0 ? (
            <span className="flex items-center text-emerald-400 font-bold">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              +{delta}%
            </span>
          ) : delta < 0 ? (
            <span className="flex items-center text-red-400 font-bold">
              <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
              {delta}%
            </span>
          ) : (
            <span className="flex items-center text-slate-400">
              <Minus className="h-3.5 w-3.5 mr-0.5" />
              0.0%
            </span>
          )}
          <span className="text-[11px] text-slate-400">{deltaLabel}</span>
        </div>
      )}
    </div>
  );
};
