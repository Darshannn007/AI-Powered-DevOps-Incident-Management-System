import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { testSlackAlert } from '../services/notificationService';
import { Send, Bell, X, CheckCheck, AlertTriangle, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';

// --- Static SRE Notifications (Real-looking, project-relevant) ---
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'critical',
    icon: ShieldAlert,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
    title: 'SLA Breach Detected',
    message: 'INC-20261117-0042 (HighCpuUtilization - auth-service) crossed 15-min CRITICAL SLA. Auto-escalated to Slack.',
    time: '2m ago',
    read: false,
  },
  {
    id: 2,
    type: 'ai',
    icon: Zap,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-50',
    title: 'AI RCA Completed',
    message: 'Gemini 3.5 Flash analyzed INC-20261117-0039 (DatabaseConnectionPool). Root cause: HikariCP max-pool-size=10 exhausted under peak load.',
    time: '8m ago',
    read: false,
  },
  {
    id: 3,
    type: 'alert',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50',
    title: 'Alert Storm Suppressed',
    message: '47 duplicate Prometheus alerts for payment-service suppressed via MD5 fingerprint deduplication. 1 active incident created.',
    time: '15m ago',
    read: false,
  },
  {
    id: 4,
    type: 'resolved',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50',
    title: 'Incident Auto-Resolved',
    message: 'INC-20261117-0035 (MemoryLeakDetected - order-service) resolved by engineer. MTTR: 12.4 minutes. SLA Met ✓',
    time: '32m ago',
    read: true,
  },
  {
    id: 5,
    type: 'alert',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50',
    title: 'New HIGH Alert Ingested',
    message: 'Prometheus alert: DiskSpaceWarning on prod-node-03. Severity: HIGH. Auto-ticket INC-20261117-0044 created.',
    time: '41m ago',
    read: true,
  },
];

export default function Mainlayout() {
  const { user } = useAuth();
  const [testingSlack, setTestingSlack] = useState(false);
  const [slackMessage, setSlackMessage] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleTestSlack = async () => {
    setTestingSlack(true);
    try {
      await testSlackAlert(user?.fullName || 'Darshan');
      setSlackMessage('Slack Alert Sent! 🚀');
      setTimeout(() => setSlackMessage(''), 4000);
    } catch (err) {
      setSlackMessage('Slack Failed: ' + (err.message || 'Error'));
      setTimeout(() => setSlackMessage(''), 4000);
    } finally {
      setTestingSlack(false);
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="flex h-screen bg-[#F4F6F8] overflow-hidden">
      {/* Left Slim Floating Sidebar */}
      <Sidebar />

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white rounded-3xl mx-4 mt-4 px-6 flex items-center justify-between shadow-card border border-gray-100/80">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              APDIMS
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              v2.0 SRE
            </span>
          </div>

          {/* Center Pill Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-full border border-gray-100">
            {[
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/incidents', label: 'Incidents' },
              { to: '/alerts', label: 'Alerts Feed' },
              { to: '/monitoring', label: 'Live Telemetry' },
            ].map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-gray-500 hover:text-slate-900'
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleTestSlack}
              disabled={testingSlack}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[#4A154B]/10 text-[#4A154B] hover:bg-[#4A154B]/15 transition-all border border-[#4A154B]/20"
            >
              <Send className="w-3.5 h-3.5" />
              {testingSlack ? 'Sending...' : 'Test Slack'}
            </button>

            {slackMessage && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {slackMessage}
              </span>
            )}

            {/* === NOTIFICATION BELL === */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(prev => !prev)}
                className="relative w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white px-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Panel */}
              {notifOpen && (
                <div className="absolute right-0 top-14 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">SRE Notifications</h3>
                      <p className="text-xs text-gray-400 font-medium">{unreadCount} unread alerts</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full transition-colors"
                        >
                          <CheckCheck className="w-3 h-3" />
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setNotifOpen(false)}
                        className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-50">
                    {notifications.map((notif) => {
                      const Icon = notif.icon;
                      return (
                        <div
                          key={notif.id}
                          onClick={() => markRead(notif.id)}
                          className={`flex gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-gray-50/80 ${
                            !notif.read ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-xl ${notif.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <Icon className={`w-4 h-4 ${notif.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-xs font-bold ${!notif.read ? 'text-slate-900' : 'text-slate-600'}`}>
                                {notif.title}
                              </p>
                              <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">{notif.time}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-[11px] text-center text-gray-400 font-medium">
                      Powered by APDIMS SRE Alert Engine • Auto-refresh every 60s
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-bold flex items-center justify-center shadow-sm">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'D'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.fullName || 'Darshan Desale'}
                </p>
                <p className="text-[11px] font-semibold text-emerald-600">
                  {user?.role || 'Lead SRE'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Child Pages render inside here */}
        <main className="flex-1 overflow-y-auto px-4 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
