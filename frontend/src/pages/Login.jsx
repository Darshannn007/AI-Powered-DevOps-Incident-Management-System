import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('darshan@apdims.com');
  const [password, setPassword] = useState('darshan123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Normal Login Submit Function
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // 2. Demo Login Helpers (Direct One-Click Login from HMS screenshot style!)
  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError('');
    setTimeout(async () => {
      try {
        await login(demoEmail, demoPassword);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Demo login failed');
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleDemoAdminLogin = () => {
    handleDemoLogin('darshan@apdims.com', 'darshan123');
  };

  const handleDemoEngineerLogin = () => {
    handleDemoLogin('mayur@apdims.com', 'mayur123');
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl border border-gray-100">
        {/* Brand Icon */}
        <div className="w-14 h-14 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-900">APDIMS SRE Login</h2>
          <p className="text-xs font-semibold text-gray-400 mt-1">
            DevOps Incident Management Command Center
          </p>
        </div>

        {/* Quick Demo Login Buttons (Super convenient for viva/interview!) */}
        <div className="mb-6 p-3 bg-gray-50 border border-gray-200/80 rounded-2xl text-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            ⚡ Quick 1-Click Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoAdminLogin}
              className="px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-gray-200 hover:border-emerald-300 shadow-sm transition-all"
            >
              Admin (Darshan)
            </button>
            <button
              type="button"
              onClick={handleDemoEngineerLogin}
              className="px-3 py-2 bg-white hover:bg-amber-50 text-amber-700 font-bold text-xs rounded-xl border border-gray-200 hover:border-amber-300 shadow-sm transition-all"
            >
              SRE Engineer
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="darshan@apdims.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-2xl text-xs font-bold shadow-md transition-all mt-4 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/register" className="text-xs font-bold text-emerald-600 hover:underline">
            Don't have an account? Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
