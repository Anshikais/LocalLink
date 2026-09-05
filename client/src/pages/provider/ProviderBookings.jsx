import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { Briefcase, Calendar, Clock, CheckCircle } from 'lucide-react';

export default function ProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotification();

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch provider bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`/api/bookings/${id}/status`, { status });
      showToast(`Status updated to ${status}`);
      fetchBookings();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Appointment Manager</h2>
          <p className="text-xs text-slate-500">Track and advance service booking statuses.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {['all', 'Pending', 'Accepted', 'On the Way', 'In Progress', 'Completed', 'Cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === st ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-xs text-slate-500">Loading appointments...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          No appointments matching status "{filterStatus}".
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(b => (
            <div key={b._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded">{b.bookingId}</span>
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">{b.status}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900">{b.serviceName}</h3>
                <p className="text-xs text-slate-600">Customer: {b.customer?.name} ({b.address?.phone})</p>
                <p className="text-xs text-slate-400">Date: {b.bookingDate} at {b.bookingTime} • {b.address?.street}, {b.address?.city}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-extrabold text-slate-900 text-base">₹{b.price}</span>
                <Link
                  to={`/booking/${b._id}`}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Manage Status
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
