import React from 'react';

interface ScoreMeterProps {
  score: number;
  tier?: string;
  size?: 'sm' | 'md' | 'lg';
  subtitle?: string;
}

export const ScoreMeter: React.FC<ScoreMeterProps> = ({
  score,
  tier = 'Good',
  size = 'md',
  subtitle = 'Municipal Sustainability Index'
}) => {
  const normalizedScore = Math.max(0, Math.min(100, score));
  
  // Color configuration
  const getColor = (s: number) => {
    if (s >= 80) return { stroke: '#10B981', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Excellent' };
    if (s >= 60) return { stroke: '#3B82F6', text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', label: 'Good' };
    if (s >= 40) return { stroke: '#F59E0B', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Moderate' };
    if (s >= 20) return { stroke: '#F97316', text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', label: 'Poor' };
    return { stroke: '#EF4444', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Critical' };
  };

  const theme = getColor(normalizedScore);
  const radius = size === 'lg' ? 68 : (size === 'md' ? 52 : 36);
  const strokeWidth = size === 'lg' ? 10 : (size === 'md' ? 8 : 6);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center">
        <svg
          className="transform -rotate-90"
          width={radius * 2 + strokeWidth * 2}
          height={radius * 2 + strokeWidth * 2}
        >
          {/* Background circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="#1F293D"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={theme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`font-black ${size === 'lg' ? 'text-4xl' : (size === 'md' ? 'text-2xl' : 'text-lg')} ${theme.text}`}>
            {normalizedScore}
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">/ 100</span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${theme.bg} ${theme.text} ${theme.border}`}>
          {tier || theme.label}
        </span>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};
