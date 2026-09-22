import React, { useState, useEffect } from 'react';
import { X, Sparkles, Brain, CheckSquare, ShieldAlert, Cpu, RefreshCw } from 'lucide-react';
import { analyzeWithGemini, getLatestAiAnalysis } from '../../services/aiService';

export const AIAnalysisModal = ({ isOpen, incident, onClose }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && incident) {
      loadOrRunAnalysis();
    }
  }, [isOpen, incident]);

  const loadOrRunAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      // First try to fetch latest existing analysis
      const existing = await getLatestAiAnalysis(incident.id);
      setAnalysis(existing);
    } catch (e) {
      // If no existing analysis, trigger fresh Gemini analysis
      triggerFreshAnalysis();
      return;
    } finally {
      setLoading(false);
    }
  };

  const triggerFreshAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const fresh = await analyzeWithGemini(incident.id);
      setAnalysis(fresh);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gemini AI diagnosis failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !incident) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900">Gemini AI SRE Diagnosis</h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                gemini-1.5-flash
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-400">
              {incident.incidentNumber} • {incident.serviceName}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center">
            <RefreshCw className="w-10 h-10 mx-auto text-purple-600 animate-spin mb-4" />
            <p className="text-sm font-bold text-slate-800">Gemini AI is diagnosing logs & metrics...</p>
            <p className="text-xs text-gray-400 mt-1">Cross-referencing SRE runbooks and error signatures</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700 mb-4">
            {error}
          </div>
        )}

        {/* Analysis Result Card */}
        {analysis && !loading && (
          <div className="space-y-5">
            {/* Confidence Score Pill */}
            <div className="flex items-center justify-between p-4 bg-purple-50/70 border border-purple-100 rounded-2xl">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span className="text-xs font-bold text-slate-800">Diagnosis Confidence</span>
              </div>
              <span className="text-sm font-black text-purple-700 bg-white px-3 py-1 rounded-full shadow-sm">
                {(analysis.confidenceScore * 100).toFixed(0)}%
              </span>
            </div>

            {/* Root Cause Summary */}
            <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Root Cause Analysis
              </h4>
              <p className="text-sm font-medium text-slate-800 leading-relaxed">
                {analysis.rootCauseSummary}
              </p>
            </div>

            {/* Suggested Actions Checklist */}
            <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                Recommended Remediation Steps
              </h4>
              <ul className="space-y-2">
                {analysis.suggestedActions?.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prevention Tip */}
            {analysis.preventionTip && (
              <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl text-xs">
                <span className="font-extrabold text-emerald-900 block mb-1">💡 SRE Prevention Rule:</span>
                <span className="font-medium text-emerald-800">{analysis.preventionTip}</span>
              </div>
            )}

            {/* Re-analyze Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={triggerFreshAnalysis}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-analyze with Gemini</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
