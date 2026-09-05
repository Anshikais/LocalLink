import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SkeletonLoader from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import { 
  Briefcase, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Eye, 
  Calendar,
  X
} from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/bookings?status=${statusFilter}`);
      setBookings(res.data.bookings || res.data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await axios.patch(`/api/admin/bookings/${bookingId}/status`, { status: newStatus });
      fetchBookings();
      setSelectedBooking(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">Completed</span>;
      case 'Accepted':
        return <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">Accepted</span>;
      case 'On the Way':
        return <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">On the Way</span>;
      case 'In Progress':
        return <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">In Progress</span>;
      case 'Cancelled':
        return <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">Cancelled</span>;
      default:
        return <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Booking Management</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Monitor doorstep service requests, lifecycle statuses, and platform fee collection.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        {['', 'Pending', 'Accepted', 'On the Way', 'Completed', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === st
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {st === '' ? 'All Statuses' : st}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      {loading ? (
        <SkeletonLoader count={4} />
      ) : bookings.length === 0 ? (
        <EmptyState title="No bookings found" message="No booking records match the selected status filter." />
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                  <th className="p-4">Booking ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Provider</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-extrabold text-slate-900">
                      {b.bookingId || `#${b._id.slice(-6)}`}
                    </td>

                    <td className="p-4">
                      <h4 className="font-extrabold text-slate-900">{b.customer?.name || 'Customer'}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{b.customer?.phone || b.address?.phone}</p>
                    </td>

                    <td className="p-4 font-semibold text-slate-800">
                      {b.provider?.businessName || b.provider?.user?.name || 'Provider'}
                    </td>

                    <td className="p-4 font-medium text-slate-700">
                      {b.serviceName}
                    </td>

                    <td className="p-4 text-slate-600 font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.bookingDate}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{b.bookingTime}</span>
                    </td>

                    <td className="p-4 font-extrabold text-slate-900">
                      ₹{b.price}
                      <span className="block text-[10px] text-emerald-700 font-normal">Fee: ₹{b.platformFee || 0}</span>
                    </td>

                    <td className="p-4">
                      {getStatusBadge(b.status)}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-lg transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Status Update Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                Booking {selectedBooking.bookingId || `#${selectedBooking._id.slice(-6)}`}
              </h3>
              <button onClick={() => setSelectedBooking(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p><strong className="text-slate-900">Service:</strong> {selectedBooking.serviceName}</p>
              <p><strong className="text-slate-900">Customer:</strong> {selectedBooking.customer?.name} ({selectedBooking.customer?.phone})</p>
              <p><strong className="text-slate-900">Address:</strong> {selectedBooking.address?.street}, {selectedBooking.address?.city}</p>
              <p><strong className="text-slate-900">Price:</strong> ₹{selectedBooking.price} (Platform Fee: ₹{selectedBooking.platformFee || 0})</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Update Status</label>
              <div className="grid grid-cols-2 gap-2">
                {['Pending', 'Accepted', 'On the Way', 'In Progress', 'Completed', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedBooking._id, st)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors ${
                      selectedBooking.status === st
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
