import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SkeletonLoader from '../../components/SkeletonLoader';
import { 
  Users, 
  UserCheck, 
  FolderTree, 
  Wrench, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  Star, 
  IndianRupee, 
  TrendingUp,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/statistics')
      .then(res => setStats(res.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <SkeletonLoader count={4} />;
  }

  return (
    <div className="space-y-8">
      
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Overview & Statistics</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time marketplace metrics and provider health</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/providers"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" /> Manage Providers
          </Link>
        </div>
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        
        {/* Total Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Users</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats?.totalUsers || 0}</p>
          <p className="text-[11px] text-slate-500 font-medium">
            {stats?.customerUsers || 0} Customers • {stats?.providerUsers || 0} Providers
          </p>
        </div>

        {/* Total Providers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Providers</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats?.totalProviders || 0}</p>
          <p className="text-[11px] text-emerald-700 font-bold">
            {stats?.approvedProviders || 0} Approved • {stats?.pendingProviders || 0} Pending
          </p>
        </div>

        {/* Categories & Services */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catalog</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats?.totalCategories || 0}</p>
          <p className="text-[11px] text-slate-500 font-medium">
            {stats?.totalServices || 0} Active Services in Database
          </p>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats?.totalBookings || 0}</p>
          <p className="text-[11px] text-emerald-700 font-bold">
            {stats?.completedBookings || 0} Completed • {stats?.pendingBookings || 0} Pending
          </p>
        </div>

      </div>

      {/* Financial & Quality Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Gross Volume */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Transaction Value</span>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900">₹{(stats?.grossTransactionValue || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Platform Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Commission (10%)</span>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-700">₹{(stats?.platformRevenue || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Rating</span>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{stats?.averageRating || 5.0}★ / 5.0</p>
          </div>
        </div>

      </div>

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Categories & Services Quick Actions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-emerald-600" /> Category & Service Management
            </h3>
            <Link to="/admin/categories" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Add or edit category names, descriptions, lucide icons, and Cloudinary images. Changes instantly populate on the user homepage.
          </p>

          <div className="flex gap-2">
            <Link to="/admin/categories" className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl text-center transition-colors">
              Categories ({stats?.totalCategories})
            </Link>
            <Link to="/admin/services" className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-xl text-center transition-colors">
              Services Catalog ({stats?.totalServices})
            </Link>
          </div>
        </div>

        {/* Provider Verification Queue Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" /> Provider Verification Queue
            </h3>
            <Link to="/admin/providers" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
              Review Queue <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats?.pendingProviders > 0 ? (
            <div className="bg-amber-50 border border-amber-200/80 p-3.5 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">{stats.pendingProviders} Pending Applications</h4>
                <p className="text-[11px] text-amber-700">Review business documentation to approve or reject providers.</p>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900">Verification Queue Clear</h4>
                <p className="text-[11px] text-emerald-700">All registered provider accounts have been reviewed.</p>
              </div>
            </div>
          )}

          <Link to="/admin/providers" className="block w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl text-center transition-colors">
            Manage All Providers ({stats?.totalProviders})
          </Link>
        </div>

      </div>

    </div>
  );
}
