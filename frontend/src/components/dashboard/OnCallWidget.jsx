import React from 'react';
import { ShieldCheck, PhoneCall } from 'lucide-react';

export const OnCallWidget = () => {
  const onCallTeam = [
    { name: 'Darshan Desale', role: 'Primary SRE', initials: 'DD', bg: 'bg-emerald-500' },
    { name: 'Mayur Desale',   role: 'Secondary SRE', initials: 'MD', bg: 'bg-amber-500' },
    { name: 'System Bot',     role: 'Auto Remediation', initials: 'AI', bg: 'bg-purple-500' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100/80 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">DevOps On-Call</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
        </div>
        <h4 className="text-lg font-bold text-slate-900 mt-1">Active SRE Shift</h4>
        <p className="text-xs text-gray-400 font-medium">Automatic paging & Slack escalation linked</p>
      </div>

      {/* Avatars Stack (Matching Bottom-Right Avatars in Screenshot) */}
      <div className="my-4 flex items-center gap-2">
        <div className="flex -space-x-2 overflow-hidden">
          {onCallTeam.map((member, idx) => (
            <div
              key={idx}
              title={`${member.name} (${member.role})`}
              className={`inline-block h-10 w-10 rounded-full text-white font-bold text-xs flex items-center justify-center ring-2 ring-white ${member.bg}`}
            >
              {member.initials}
            </div>
          ))}
          <div className="inline-block h-10 w-10 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white">
            +2
          </div>
        </div>
        <span className="text-xs font-bold text-slate-700 ml-2">Darshan on shift</span>
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
        <span>Escalation Rule: <strong>15m SLA</strong></span>
        <PhoneCall className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};
