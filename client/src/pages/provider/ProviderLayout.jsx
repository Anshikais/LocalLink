import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  Wrench, 
  DollarSign, 
  User, 
  Star, 
  LogOut, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function ProviderLayout() {
  const { user, providerProfile, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'provider') {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-sm font-bold text-slate-800">Provider Access Required</p>
        <button onClick={() => navigate('/login')} className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold">
          Log In as Provider
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Pending verification alert banner */}
      {providerProfile?.verificationStatus === 'pending' && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              Your provider registration is currently <strong>Pending Admin Verification</strong>. Once approved, your profile will be publicly discoverable by customers.
            </span>
          </div>
          <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
            Under Review
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Sidebar */}
        <aside className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <img
              src={user.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'}
              alt={user.name}
              className="w-12 h-12 rounded-xl object-cover border"
            />
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-slate-900 truncate">
                {providerProfile?.businessName || user.name}
              </h3>
              <p className="text-xs text-slate-500">Provider Portal</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            <NavLink
              to="/provider/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" /> Overview Dashboard
            </NavLink>

            <NavLink
              to="/provider/bookings"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <Briefcase className="w-4 h-4" /> Appointments Manager
            </NavLink>

            <NavLink
              to="/provider/services"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <Wrench className="w-4 h-4" /> Services & Rates
            </NavLink>

            <NavLink
              to="/provider/earnings"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <DollarSign className="w-4 h-4" /> Earnings & Payouts
            </NavLink>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-4">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
