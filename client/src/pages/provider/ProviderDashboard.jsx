import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  Star, 
  MapPin, 
  Phone,
  UserCheck
} from 'lucide-react';

export default function ProviderDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotification();

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/providers/dashboard/stats');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch provider dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await axios.patch(`/api/bookings/${bookingId}/status`, { status });
      showToast(`Request ${status}`);
      fetchStats();
    } catch (err) {
      showToast('Failed to update request status', 'error');
    }
  };

  if (loading) return <div className="p-8 text-xs text-slate-500">Loading provider stats...</div>;
  if (!data) return null;

  const { stats, recentBookings, provider } = data;

  return (
    <div className="space-y-8">
      
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Requests</span>
          <p className="text-2xl font-extrabold text-slate-900">{stats.totalBookings}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Pending Requests</span>
          <p className="text-2xl font-extrabold text-amber-700">{stats.pendingBookings}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Completed Jobs</span>
          <p className="text-2xl font-extrabold text-emerald-700">{stats.completedJobs}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-200 bg-sky-50/20 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">Net Earnings (₹)</span>
          <p className="text-2xl font-extrabold text-sky-700">₹{stats.totalEarnings}</p>
        </div>

      </div>

      {/* Incoming Booking Requests Queue */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">Incoming Booking Requests</h3>
            <p className="text-xs text-slate-500">Manage new service requests from nearby customers.</p>
          </div>
          <Link to="/provider/bookings" className="text-xs font-bold text-sky-600 hover:underline">
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {recentBookings.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No incoming requests at the moment.</p>
          ) : (
            recentBookings.map(b => (
              <div key={b._id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">{b.bookingId}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      b.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900">{b.serviceName}</h4>
                  <p className="text-xs text-slate-600">
                    Customer: <span className="font-semibold text-slate-800">{b.customer?.name}</span> ({b.address?.phone})
                  </p>
                  <p className="text-xs text-slate-400">
                    Scheduled: {b.bookingDate} at {b.bookingTime} • Location: {b.address?.city}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-slate-900 text-base mr-2">₹{b.price}</span>

                  {b.status === 'Pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusUpdate(b._id, 'Accepted')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(b._id, 'Rejected')}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <Link
                      to={`/booking/${b._id}`}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-colors"
                    >
                      Update Status
                    </Link>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
