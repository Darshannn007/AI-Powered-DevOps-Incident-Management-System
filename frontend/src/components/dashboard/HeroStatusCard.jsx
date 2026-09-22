import React from 'react';
import { ShieldCheck, ArrowUpRight, Activity } from 'lucide-react';

export const HeroStatusCard = ({ activeOutages = 0, uptime = '99.98%' }) => {
  const isHealthy = activeOutages === 0;

  return (
    <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 shadow-lg shadow-emerald-700/20 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
      {/* Background soft ambient pattern */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">
              System Core Health
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 text-white backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Live
            </span>
          </div>
          <h2 className="text-xl font-black mt-1 tracking-tight">
            {isHealthy ? 'All Services Operational' : `${activeOutages} Active Critical Outage`}
          </h2>
        </div>

        {/* Top Right Arrow / Icon */}
        <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
          <ArrowUpRight className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Main Metric Highlight (like $78,989.09 in reference) */}
      <div className="my-3 relative z-10">
        <p className="text-[11px] font-medium text-emerald-100">Service Availability</p>
        <p className="text-3xl sm:text-4xl font-black tracking-tight mt-0.5">{uptime}</p>
      </div>

      {/* Card Footer: MTTA & MTTR */}
      <div className="flex items-center justify-between pt-3 border-t border-white/15 text-[11px] font-semibold text-emerald-50 relative z-10">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-200" />
          <span>Avg MTTA: <strong>3.4m</strong></span>
        </div>
        <div>
          <span>Avg MTTR: <strong>14.2m</strong></span>
        </div>
      </div>
    </div>
  );
};
