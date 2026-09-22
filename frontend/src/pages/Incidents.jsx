import React, { useState, useEffect } from 'react';
import { getAllIncidents } from '../services/incidentService';
import { IncidentTable } from '../components/dashboard/IncidentTable';
import { CreateIncidentModal } from '../components/modals/CreateIncidentModal';
import { ResolveIncidentModal } from '../components/modals/ResolveIncidentModal';
import { AIAnalysisModal } from '../components/modals/AIAnalysisModal';
import { Plus, Search } from 'lucide-react';

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [resolveTarget, setResolveTarget] = useState(null);
  const [aiTarget, setAiTarget] = useState(null);

  const fetchIncidents = async () => {
    try {
      const data = await getAllIncidents();
      setIncidents(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const filtered = incidents.filter((inc) => {
    const matchesSearch =
      inc.title?.toLowerCase().includes(search.toLowerCase()) ||
      inc.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
      inc.incidentNumber?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Incidents Directory</h2>
          <p className="text-xs font-semibold text-gray-400 mt-1">Full lifecycle management & audit trail</p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-full text-xs font-bold shadow-md transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>+ Report Incident</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-card border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, service, or INC-number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {['ALL', 'TRIGGERED', 'ACKNOWLEDGED', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <IncidentTable
        incidents={filtered}
        onRunAI={(inc) => setAiTarget(inc)}
        onResolve={(inc) => setResolveTarget(inc)}
      />

      <CreateIncidentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={fetchIncidents}
      />
      <ResolveIncidentModal
        isOpen={!!resolveTarget}
        incident={resolveTarget}
        onClose={() => setResolveTarget(null)}
        onResolved={fetchIncidents}
      />
      <AIAnalysisModal
        isOpen={!!aiTarget}
        incident={aiTarget}
        onClose={() => setAiTarget(null)}
      />
    </div>
  );
}
