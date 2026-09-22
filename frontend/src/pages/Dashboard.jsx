import React, { useState, useEffect } from 'react';
import { getAllIncidents } from '../services/incidentService';
import { getActiveAlerts } from '../services/alertService';
import { WelcomeHeader } from '../components/dashboard/WelcomeHeader';
import { HeroStatusCard } from '../components/dashboard/HeroStatusCard';
import { IncidentBarChart } from '../components/dashboard/IncidentBarChart';
import { IncidentTable } from '../components/dashboard/IncidentTable';
import { OnCallWidget } from '../components/dashboard/OnCallWidget';
import StatCard from '../components/StatCard';
import { CreateIncidentModal } from '../components/modals/CreateIncidentModal';
import { ResolveIncidentModal } from '../components/modals/ResolveIncidentModal';
import { AIAnalysisModal } from '../components/modals/AIAnalysisModal';
import { Flame, Bell } from 'lucide-react';

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [resolveTarget, setResolveTarget] = useState(null);
  const [aiTarget, setAiTarget] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [incList, alertList] = await Promise.all([
        getAllIncidents().catch(() => []),
        getActiveAlerts().catch(() => []),
      ]);
      setIncidents(incList || []);
      setAlerts(alertList || []);
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const criticalOutages = incidents.filter(
    (i) => i.severity === 'CRITICAL' && (i.status === 'TRIGGERED' || i.status === 'ACKNOWLEDGED')
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. Header with Greeting & Action */}
      <WelcomeHeader onOpenCreateModal={() => setIsCreateOpen(true)} />

      {/* 2. Bento Grid Top Row (Exact match to reference photo!) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Emerald Visa-Style Health Card */}
        <div className="lg:col-span-4">
          <HeroStatusCard
            activeOutages={criticalOutages.length}
            uptime={criticalOutages.length > 0 ? '98.85%' : '99.98%'}
          />
        </div>

        {/* Center: Rounded Bar Chart with April Green Highlight */}
        <div className="lg:col-span-5">
          <IncidentBarChart />
        </div>

        {/* Right: Stat Cards Stack */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <StatCard
            title="Total Incidents"
            value={incidents.length}
            change="+4.2%"
            icon={Flame}
            color="rose"
          />
          <StatCard
            title="Active Firing Alerts"
            value={alerts.length}
            change="-12%"
            icon={Bell}
            color="amber"
          />
        </div>
      </div>

      {/* 3. Bento Grid Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Recent Incidents List (8 columns) */}
        <div className="lg:col-span-8">
          <IncidentTable
            incidents={incidents.slice(0, 5)}
            onRunAI={(inc) => setAiTarget(inc)}
            onResolve={(inc) => setResolveTarget(inc)}
          />
        </div>

        {/* Right: DevOps On-Call Team Widget (4 columns) */}
        <div className="lg:col-span-4">
          <OnCallWidget />
        </div>
      </div>

      {/* Popups & Modals */}
      <CreateIncidentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={fetchDashboardData}
      />

      <ResolveIncidentModal
        isOpen={!!resolveTarget}
        incident={resolveTarget}
        onClose={() => setResolveTarget(null)}
        onResolved={fetchDashboardData}
      />

      <AIAnalysisModal
        isOpen={!!aiTarget}
        incident={aiTarget}
        onClose={() => setAiTarget(null)}
      />
    </div>
  );
}
