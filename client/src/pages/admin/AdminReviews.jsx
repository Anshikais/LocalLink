import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SkeletonLoader from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import { 
  Star, 
  Search, 
  Eye, 
  EyeOff, 
  Trash2, 
  AlertTriangle 
} from 'lucide-react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportedOnly, setReportedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/reviews?reportedOnly=${reportedOnly}`);
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [reportedOnly]);

  const handleToggleHide = async (id) => {
    try {
      await axios.patch(`/api/admin/reviews/${id}/toggle-hide`);
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle review visibility');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review permanently?')) return;
    try {
      await axios.delete(`/api/admin/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete review');
    }
  };

  const filtered = reviews.filter(r =>
    r.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.provider?.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Review Moderation</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Monitor customer feedback, hide inappropriate content, or recalculate ratings.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews by customer, provider, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200/90 pl-10 pr-4 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shrink-0">
          <input
            type="checkbox"
            checked={reportedOnly}
            onChange={(e) => setReportedOnly(e.target.checked)}
            className="rounded text-amber-500 focus:ring-amber-500"
          />
          <span className="flex items-center gap-1 text-amber-900">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Reported Only
          </span>
        </label>
      </div>

      {/* Reviews Table */}
      {loading ? (
        <SkeletonLoader count={4} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No reviews found" message="No customer reviews match your current filter." />
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Provider</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Comment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-extrabold text-slate-900">
                      {r.customer?.name || 'Customer'}
                    </td>

                    <td className="p-4 font-semibold text-slate-800">
                      {r.provider?.businessName || 'Provider'}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{r.rating}★</span>
                      </div>
                    </td>

                    <td className="p-4 max-w-sm">
                      <p className="text-slate-600 line-clamp-2 font-medium">{r.comment}</p>
                    </td>

                    <td className="p-4">
                      {r.isReported ? (
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          Hidden / Reported
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Visible
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleHide(r._id)}
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title={r.isReported ? 'Restore Review' : 'Hide Review'}
                        >
                          {r.isReported ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
