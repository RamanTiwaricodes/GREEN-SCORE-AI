import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';

interface RadarHealthChartProps {
  data: {
    domain: string;
    score: number;
    benchmark: number;
  }[];
}

export const RadarHealthChart: React.FC<RadarHealthChartProps> = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#1F293D" />
          <PolarAngleAxis dataKey="domain" stroke="#94A3B8" fontSize={11} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              borderColor: '#1E293B',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#F8FAFC'
            }}
          />
          <Radar
            name="City Score"
            dataKey="score"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.4}
          />
          <Radar
            name="Target Benchmark"
            dataKey="benchmark"
            stroke="#3B82F6"
            strokeDasharray="3 3"
            fill="#3B82F6"
            fillOpacity={0.1}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
