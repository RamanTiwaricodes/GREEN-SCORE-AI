import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { ImpactVerification } from '../../types';

interface ImpactComparisonChartProps {
  verifications: ImpactVerification[];
}

export const ImpactComparisonChart: React.FC<ImpactComparisonChartProps> = ({ verifications }) => {
  const data = verifications.map((v) => ({
    name: v.action_code || 'Action',
    predicted: v.predicted_delta,
    measured: v.measured_delta,
    attainment: v.goal_attainment_pct,
    verdict: v.verdict
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
          <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
          <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit=" pts" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              borderColor: '#1E293B',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#F8FAFC'
            }}
            formatter={(value: any, name: string) => [
              `${value} pts`,
              name === 'predicted' ? 'Predicted Delta' : 'Measured Delta'
            ]}
          />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
          <Bar dataKey="predicted" fill="#8B5CF6" name="Predicted Impact" radius={[4, 4, 0, 0]} />
          <Bar dataKey="measured" fill="#10B981" name="Measured Actual Impact" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
