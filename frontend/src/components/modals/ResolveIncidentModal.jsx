import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { resolveIncident } from '../../services/incidentService';

export const ResolveIncidentModal = ({ isOpen, incident, onClose, onResolved }) => {
  const [rootCause, setRootCause] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !incident) return null;

  const handleResolve = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await resolveIncident(incident.id, {
        rootCause: rootCause || incident.rootCause || 'Root cause analyzed and patch applied',
        resolutionSummary: resolutionSummary || 'Service restored to nominal operating parameters.',
      });
      onResolved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to resolve incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Resolve Incident</h3>
            <p className="text-xs font-mono text-gray-400">{incident.incidentNumber} • {incident.serviceName}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleResolve} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Root Cause Summary *</label>
            <textarea
              rows={2}
              required
              placeholder="Why did this outage occur? (e.g. Connection pool reached 100% capacity)"
              defaultValue={incident.rootCause || ''}
              onChange={(e) => setRootCause(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Resolution Summary *</label>
            <textarea
              rows={3}
              required
              placeholder="What actions were taken to restore service? (e.g. Restarted pods, increased max-pool-size to 50)"
              value={resolutionSummary}
              onChange={(e) => setResolutionSummary(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-500 hover:text-slate-800 bg-gray-100 hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md"
            >
              {loading ? 'Resolving...' : 'Confirm Resolution & Notify Slack'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
