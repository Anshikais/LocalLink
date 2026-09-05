import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  ShieldCheck, 
  Star, 
  AlertCircle,
  XCircle,
  Truck,
  Wrench,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function BookingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review submission state
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchBooking = async () => {
    try {
      const res = await axios.get(`/api/bookings/${id}`);
      setBooking(res.data);
    } catch (err) {
      console.error('Failed to fetch booking details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await axios.patch(`/api/bookings/${id}/status`, { status: newStatus });
      showToast(`Booking status updated to ${newStatus}`);
      fetchBooking();
    } catch (err) {
      console.error('Failed to update status:', err);
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please write a comment for your review', 'error');
      return;
    }
    setSubmittingReview(true);
    try {
      await axios.post('/api/reviews', {
        bookingId: booking._id,
        rating: Number(rating),
        comment: reviewComment
      });
      showToast('Review submitted successfully! Thank you for your feedback.');
      fetchBooking();
    } catch (err) {
      console.error('Failed to submit review:', err);
      showToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs">Loading booking details...</div>;
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto p-12 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-800">Booking Not Found</h3>
        <Link to="/bookings" className="inline-block px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold">
          Back to Bookings
        </Link>
      </div>
    );
  }

  const timelineSteps = [
    { label: 'Booking Requested', key: 'Pending' },
    { label: 'Provider Accepted', key: 'Accepted' },
    { label: 'Provider On The Way', key: 'On the Way' },
    { label: 'Service In Progress', key: 'In Progress' },
    { label: 'Completed', key: 'Completed' }
  ];

  const getStepStatusClass = (stepKey) => {
    const statusOrder = ['Pending', 'Accepted', 'On the Way', 'In Progress', 'Completed'];
    const currentIdx = statusOrder.indexOf(booking.status);
    const stepIdx = statusOrder.indexOf(stepKey);

    if (booking.status === 'Rejected' || booking.status === 'Cancelled') {
      return 'bg-slate-200 text-slate-400 border-slate-300';
    }

    if (stepIdx <= currentIdx) {
      return 'bg-emerald-500 text-white border-emerald-500 shadow-md';
    }
    return 'bg-white text-slate-400 border-slate-300';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Booking ID</span>
              <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">
                {booking.bookingId}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{booking.serviceName}</h1>
            <p className="text-xs text-slate-500 mt-0.5">Requested on {new Date(booking.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider ${
              booking.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
              booking.status === 'Cancelled' || booking.status === 'Rejected' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
              'bg-sky-100 text-sky-800 border border-sky-200'
            }`}>
              {booking.status}
            </span>
          </div>
        </div>

        {/* Live Timeline Step Indicator */}
        <div className="py-4 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Booking Progress</h3>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {timelineSteps.map((st, idx) => (
              <div key={st.key} className="flex flex-col items-center text-center space-y-2 relative">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${getStepStatusClass(st.key)}`}>
                  {idx + 1}
                </div>
                <span className="text-[11px] font-semibold text-slate-700 leading-snug">
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Booking Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Address */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Provider / Customer Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              {user?.role === 'provider' ? 'Customer Details' : 'Service Provider Details'}
            </h3>

            <div className="flex items-center gap-4">
              <img
                src={
                  user?.role === 'provider' 
                    ? (booking.customer?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100')
                    : (booking.provider?.user?.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100')
                }
                alt="Avatar"
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
              />
              <div className="space-y-0.5">
                <h4 className="font-bold text-base text-slate-900">
                  {user?.role === 'provider' ? booking.customer?.name : booking.provider?.businessName}
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-sky-600" />
                  {user?.role === 'provider' ? booking.address?.phone : (booking.provider?.user?.phone || booking.address?.phone)}
                </p>
              </div>
            </div>
          </div>

          {/* Description & Problem Photos */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Work Requirements & Notes
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {booking.description}
            </p>

            {booking.images && booking.images.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold text-slate-500">Attached Problem Photos:</span>
                <div className="flex flex-wrap gap-3">
                  {booking.images.map((img, i) => (
                    <img key={i} src={img} alt="Problem" className="w-20 h-20 rounded-xl object-cover border" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Review Submission Form (Only if Completed & Customer) */}
          {booking.status === 'Completed' && user?.role === 'customer' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Leave Provider Review
              </h3>

              {booking.hasReview ? (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  You have submitted a review for this completed booking.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Rating (1 to 5 Stars)</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-6 h-6 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Written Review</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Share your experience regarding punctuality, work quality, and professionalism..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-all shadow-md"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Schedule, Address & Status Updater */}
        <div className="space-y-6">
          
          {/* Schedule & Price Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Appointment Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-sky-600" /> Scheduled Date</span>
                <span className="font-semibold text-slate-900">{booking.bookingDate}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-sky-600" /> Preferred Time</span>
                <span className="font-semibold text-slate-900">{booking.bookingTime}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-rose-500" /> Delivery Address</span>
                <span className="font-semibold text-slate-900 text-right max-w-[150px] truncate">{booking.address?.street}, {booking.address?.city}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-sky-700">₹{booking.price}</span>
              </div>
            </div>
          </div>

          {/* Provider Controls (Update Status) */}
          {user?.role === 'provider' && booking.status !== 'Completed' && booking.status !== 'Cancelled' && booking.status !== 'Rejected' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                Update Appointment Status
              </h3>

              <div className="space-y-2">
                {booking.status === 'Pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate('Accepted')}
                      className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
                    >
                      Accept Request
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('Rejected')}
                      className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors"
                    >
                      Reject Request
                    </button>
                  </div>
                )}

                {booking.status === 'Accepted' && (
                  <button
                    onClick={() => handleStatusUpdate('On the Way')}
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Mark "On the Way"
                  </button>
                )}

                {booking.status === 'On the Way' && (
                  <button
                    onClick={() => handleStatusUpdate('In Progress')}
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Start Work ("In Progress")
                  </button>
                )}

                {booking.status === 'In Progress' && (
                  <button
                    onClick={() => handleStatusUpdate('Completed')}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
                  >
                    Mark Job Completed ✓
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
