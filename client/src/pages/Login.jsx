import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Wrench, Mail, Lock, LogIn, Shield, UserCheck, Briefcase } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      showToast(`Welcome back, ${data.user.name}!`);
      if (data.user.role === 'admin') navigate('/admin/dashboard');
      else if (data.user.role === 'provider') navigate('/provider/dashboard');
      else navigate('/search');
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    try {
      const data = await login(demoEmail, demoPass);
      showToast(`Logged in as ${data.user.name} (${data.user.role})!`);
      if (data.user.role === 'admin') navigate('/admin/dashboard');
      else if (data.user.role === 'provider') navigate('/provider/dashboard');
      else navigate('/search');
    } catch (err) {
      showToast('Demo login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/20">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-500">Sign in to manage your bookings and service requests.</p>
        </div>

        {/* Demo Quick Logins Box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
            ⚡ One-Click Demo Accounts:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('customer@demo.com', 'customer123')}
              className="p-2 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 text-slate-800 font-semibold flex flex-col items-center gap-1 text-[11px] transition-colors"
            >
              <UserCheck className="w-4 h-4 text-sky-600" /> Customer
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('provider@demo.com', 'provider123')}
              className="p-2 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 text-slate-800 font-semibold flex flex-col items-center gap-1 text-[11px] transition-colors"
            >
              <Briefcase className="w-4 h-4 text-sky-600" /> Provider
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@localservicefinder.com', 'admin123')}
              className="p-2 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 text-slate-800 font-semibold flex flex-col items-center gap-1 text-[11px] transition-colors"
            >
              <Shield className="w-4 h-4 text-indigo-600" /> Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-sky-600/30 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>

        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 space-y-1">
          <p>Don't have an account?</p>
          <div className="flex justify-center gap-4 font-semibold text-sky-600">
            <Link to="/register" className="hover:underline">Customer Sign Up</Link>
            <span>•</span>
            <Link to="/register-provider" className="hover:underline">Provider Registration</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
