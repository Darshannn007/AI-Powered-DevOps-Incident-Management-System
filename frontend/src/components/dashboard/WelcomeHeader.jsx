import React from 'react';
import { Plus, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const WelcomeHeader = ({ onOpenCreateModal }) => {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      {/* Greeting Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          Welcome Back, {user?.fullName?.split(' ')[0] || 'Engineer'}
        </h1>
        <p className="text-sm font-medium text-gray-500 mt-1">
          Infrastructure health is stable. All automated alert monitors active.
        </p>
      </div>

      {/* Date Pill & Primary Action Button */}
      <div className="flex items-center gap-3">
        {/* Date Filter Badge (Matching Reference) */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full text-xs font-bold text-slate-700 shadow-sm border border-gray-100">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>{today}</span>
        </div>

        {/* Primary "+ New Incident" Pill Button */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-black text-white rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Incident</span>
        </button>
      </div>
    </div>
  );
};
