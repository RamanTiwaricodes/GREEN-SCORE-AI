import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { PredictionCurvePoint } from '../../types';

interface ForecastChartProps {
  data: PredictionCurvePoint[];
  metricLabel?: string;
  unit?: string;
  targetMetric?: string;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  data,
  metricLabel = 'Forecasted Metric',
  unit = 'pts',
  targetMetric = 'GREEN_SCORE'
}) => {
  const isAQI = targetMetric === 'AQI';

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isAQI ? '#F59E0B' : '#10B981'} stopOpacity={0.4} />
              <stop offset="95%" stopColor={isAQI ? '#F59E0B' : '#10B981'} stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorSpread" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
          <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              borderColor: '#1E293B',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#F8FAFC'
            }}
            formatter={(value: any, name: string) => [
              `${value} ${unit}`,
              name === 'value' ? 'Predicted Trajectory' : (name === 'upper' ? 'Upper 95% Bound' : 'Lower 95% Bound')
            ]}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
          />

          {/* Upper bound */}
          <Area
            type="monotone"
            dataKey="upper"
            stroke="#8B5CF6"
            strokeDasharray="4 4"
            fillOpacity={0}
            name="Upper 95% CI"
          />

          {/* Main Trajectory */}
          <Area
            type="monotone"
            dataKey="value"
            stroke={isAQI ? '#F59E0B' : '#10B981'}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorVal)"
            name="Predicted Value"
          />

          {/* Lower bound */}
          <Area
            type="monotone"
            dataKey="lower"
            stroke="#8B5CF6"
            strokeDasharray="4 4"
            fillOpacity={0}
            name="Lower 95% CI"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
