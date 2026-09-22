import React, { useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowUpRight } from 'lucide-react';

const monthlyData = [
  { name: 'JAN', count: 12, resolved: 12 },
  { name: 'FEB', count: 18, resolved: 18 },
  { name: 'MAR', count: 9,  resolved: 9 },
  { name: 'APR', count: 26, resolved: 25, isPeak: true }, // Highlighted bar in screenshot
  { name: 'MAY', count: 14, resolved: 14 },
  { name: 'JUN', count: 8,  resolved: 8 },
];

export const IncidentBarChart = () => {
  const [period, setPeriod] = useState('monthly');

  return (
    <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100/80 flex flex-col justify-between">
      {/* Header with Title & Pill Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="text-base font-bold text-slate-900">Resolved Incidents</h3>
          </div>
          <p className="text-xs font-medium text-gray-400 mt-0.5">Automated AI Resolution Trend</p>
        </div>

        {/* Toggle Pills (Monthly vs Weekly) */}
        <div className="flex items-center bg-gray-50 p-1 rounded-full border border-gray-100 text-xs font-bold">
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-3 py-1 rounded-full transition-all ${
              period === 'weekly'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-gray-400 hover:text-slate-700'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-3 py-1 rounded-full transition-all ${
              period === 'monthly'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-400 hover:text-slate-700'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="h-44 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="name"
              stroke="#9CA3AF"
              fontSize={11}
              fontWeight={700}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: '#F3F4F6' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white text-xs rounded-xl p-2 shadow-lg">
                      <p className="font-bold">{payload[0].payload.name}</p>
                      <p className="text-emerald-400 font-semibold">{payload[0].value} Incidents Resolved</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[12, 12, 12, 12]}>
              {monthlyData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isPeak ? '#059669' : '#D1FAE5'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Pill Status */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
        <span className="font-semibold text-slate-700">Peak Resolution Month: <strong>April</strong></span>
        <span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
          +94.2% AI Accuracy
        </span>
      </div>
    </div>
  );
};
