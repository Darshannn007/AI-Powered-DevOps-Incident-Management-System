import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Flame, Bell, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar() {
  const { logout } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { to: '/incidents', label: 'Incidents', icon: Flame },
    { to: '/alerts', label: 'Alerts Feed', icon: Bell },
  ];

  return (
    <aside className="w-20 bg-white rounded-3xl p-3 shadow-card border border-gray-100/80 flex flex-col items-center justify-between my-4 ml-4 shrink-0">
      {/* Top Logo Icon */}
      <div className="flex flex-col items-center gap-8 w-full">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
          <ShieldCheck className="w-7 h-7" />
        </div>

        {/* Navigation Icons */}
        <nav className="flex flex-col items-center gap-3 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.label}
                className={({ isActive }) =>
                  `w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-105'
                      : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        title="Logout"
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </aside>
  );
}
