import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { testSlackAlert } from '../services/notificationService';
import { Send, Bell } from 'lucide-react';

export default function Mainlayout() {
  const { user } = useAuth();
  const [testingSlack, setTestingSlack] = useState(false);
  const [slackMessage, setSlackMessage] = useState('');

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

            <button className="relative w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </button>

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
