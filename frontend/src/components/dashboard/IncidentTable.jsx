import React from 'react';
import { SeverityBadge, StatusBadge } from '../StatusBadge';
import { Sparkles, Check, Server, ChevronRight } from 'lucide-react';

export const IncidentTable = ({ incidents = [], onSelectIncident, onRunAI, onResolve }) => {
  if (!incidents || incidents.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center shadow-card border border-gray-100/80">
        <Server className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <h4 className="text-base font-bold text-slate-900">No Incidents Reported</h4>
        <p className="text-xs text-gray-400 mt-1">All services are currently healthy and operating normally.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100/80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Incidents & Outages</h3>
          <p className="text-xs text-gray-400 font-medium">Live incident stream from APDIMS Core Engine</p>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          {incidents.length} Total Incidents
        </span>
      </div>

      {/* Table List */}
      <div className="divide-y divide-gray-50">
        {incidents.map((inc) => {
          const isResolved = inc.status === 'RESOLVED' || inc.status === 'CLOSED';

          return (
            <div
              key={inc.id}
              className="py-4 px-2 hover:bg-gray-50/60 rounded-2xl transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left: Service Icon + Title + Incident Number */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  <Server className="w-5 h-5 text-slate-700" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900 truncate">{inc.title}</p>
                    <span className="text-[11px] font-mono text-gray-400 font-semibold shrink-0">
                      {inc.incidentNumber}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                    Service: {inc.serviceName}
                  </p>
                </div>
              </div>

              {/* Middle: Badges */}
              <div className="flex items-center gap-2.5 shrink-0">
                <SeverityBadge severity={inc.severity} />
                <StatusBadge status={inc.status} />
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {/* AI Analyze Button */}
                <button
                  onClick={() => onRunAI(inc)}
                  title="Run Gemini AI Root Cause Analysis"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>AI Root Cause</span>
                </button>

                {/* Resolve Button (if not resolved) */}
                {!isResolved && (
                  <button
                    onClick={() => onResolve(inc)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Resolve</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
