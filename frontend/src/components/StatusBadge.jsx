import React from 'react';

export const SeverityBadge = ({ severity }) => {
  const styles = {
    CRITICAL: 'bg-red-50 text-red-700 border-red-200/60 ring-red-500/20',
    HIGH: 'bg-amber-50 text-amber-700 border-amber-200/60 ring-amber-500/20',
    MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200/60 ring-blue-500/20',
    LOW: 'bg-slate-50 text-slate-700 border-slate-200/60 ring-slate-500/20',
  };

  const dots = {
    CRITICAL: 'bg-red-500',
    HIGH: 'bg-amber-500',
    MEDIUM: 'bg-blue-500',
    LOW: 'bg-slate-400',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[severity] || styles.LOW}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[severity] || 'bg-slate-400'}`} />
      {severity}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    TRIGGERED: 'bg-rose-50 text-rose-700 border-rose-200/70',
    ACKNOWLEDGED: 'bg-amber-50 text-amber-700 border-amber-200/70',
    RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    CLOSED: 'bg-gray-100 text-gray-700 border-gray-200/70',
  };

  const dots = {
    TRIGGERED: 'bg-rose-500 animate-pulse',
    ACKNOWLEDGED: 'bg-amber-500',
    RESOLVED: 'bg-emerald-500',
    CLOSED: 'bg-gray-400',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.TRIGGERED}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-gray-400'}`} />
      {status}
    </span>
  );
};
