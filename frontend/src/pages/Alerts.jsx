import React, { useState, useEffect } from 'react';
import { getAllAlerts } from '../services/alertService';
import { Bell, ShieldCheck, Radio } from 'lucide-react';
import { SeverityBadge } from '../components/StatusBadge';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllAlerts()
      .then((data) => setAlerts(data || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Alert Ingestion Stream</h2>
          <p className="text-xs font-semibold text-gray-400 mt-1">
            Real-time webhook feed from Prometheus & Grafana Alertmanager
          </p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
          <span>Ingestion Webhook Active</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100">
        {alerts.length === 0 ? (
          <div className="py-12 text-center">
            <ShieldCheck className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
            <h4 className="text-base font-bold text-slate-900">No Firing Alerts</h4>
            <p className="text-xs text-gray-400 mt-1">Webhook endpoint /api/v1/alerts/webhook is listening for telemetry.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {alerts.map((alert) => (
              <div key={alert.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{alert.alertName}</p>
                    <p className="text-xs font-semibold text-gray-400">
                      Source: {alert.alertSource} • Service: {alert.serviceName}
                    </p>
                  </div>
                </div>
                <SeverityBadge severity={alert.severity} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
