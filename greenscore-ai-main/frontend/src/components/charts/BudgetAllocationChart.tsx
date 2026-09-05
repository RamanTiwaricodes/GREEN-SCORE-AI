import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { BudgetAllocationItem } from '../../types';

interface BudgetAllocationChartProps {
  allocations: BudgetAllocationItem[];
}

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4'];

export const BudgetAllocationChart: React.FC<BudgetAllocationChartProps> = ({ allocations }) => {
  const chartData = allocations.map((item, index) => ({
    name: item.department_name.split(' ')[0] + ' ' + (item.department_name.split(' ')[1] || ''),
    cost: item.cost,
    scoreGain: item.expected_score_gain,
    population: item.population_benefited,
    title: item.title,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#94A3B8" 
            fontSize={11} 
            tickLine={false}
            angle={-15}
            textAnchor="end"
          />
          <YAxis 
            stroke="#94A3B8" 
            fontSize={11} 
            tickLine={false}
            tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              borderColor: '#1E293B',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#F8FAFC'
            }}
            formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Allocated Budget']}
          />
          <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
