import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export const MetricsCard = ({ title, value, change, trend = 'up', icon: Icon, color = 'emerald' }) => {
  const colorStyles = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100/80 flex flex-col justify-between">
      {/* Top Section */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</span>
        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border ${colorStyles[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Value */}
      <div className="my-4">
        <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
      </div>

      {/* Change Pill */}
      <div className="flex items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
          <TrendingUp className="w-3 h-3" />
          {change}
        </span>
        <span className="text-gray-400 font-medium">vs last week</span>
      </div>
    </div>
  );
};
