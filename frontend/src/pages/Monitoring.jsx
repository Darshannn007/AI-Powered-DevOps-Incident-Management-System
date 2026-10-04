import React, { useState } from 'react';
import { Activity, ExternalLink, RefreshCw, Moon, Sun, ShieldCheck } from 'lucide-react';

export default function Monitoring() {
  const [theme, setTheme] = useState('light');
  const [iframeKey, setIframeKey] = useState(0);

  // Direct dashboard URL with kiosk mode (hides Grafana navbars for seamless embedding)
  const dashboardUrl = `http://localhost:3000/d/apdims-sre-dash/apdims-sre-core-monitoring-dashboard?kiosk&theme=${theme}&refresh=5s`;
  const fullGrafanaUrl = `http://localhost:3000/d/apdims-sre-dash/apdims-sre-core-monitoring-dashboard`;

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              SRE System Telemetry
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live 5s Scrape
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Real-time JVM, CPU, Memory, and HTTP metrics ingested by Prometheus and visualized via embedded Grafana.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Theme Toggle (Light/Dark in Grafana) */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
            className="px-3.5 py-2.5 rounded-2xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium text-xs flex items-center gap-2 transition-all shadow-sm"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-4 h-4 text-gray-500" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode</span>
              </>
            )}
          </button>

          {/* Reload Iframe */}
          <button
            onClick={handleRefresh}
            title="Reload metrics view"
            className="p-2.5 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Open in full Grafana window */}
          <a
            href={fullGrafanaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-sm shadow-emerald-600/20"
          >
            <span>Open in Grafana</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Embedded Grafana Dashboard Card */}
      <div className="bg-white rounded-3xl p-4 shadow-card border border-gray-100/80 overflow-hidden">
        <div className="w-full h-[780px] rounded-2xl overflow-hidden bg-gray-50 relative border border-gray-100">
          <iframe
            key={iframeKey}
            src={dashboardUrl}
            title="APDIMS SRE Core Monitoring Dashboard"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
