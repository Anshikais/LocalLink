import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { 
  User, 
  Briefcase, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Star, 
  CheckCircle, 
  Edit3,
  Plus
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user, fetchUserProfile } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'previous', 'favorites', 'profile'
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.addresses?.[0]?.street || '');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || '');
  const [pincode, setPincode] = useState(user?.addresses?.[0]?.pincode || '');

  useEffect(() => {
    axios.get('/api/bookings')
      .then(res => setBookings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const upcomingBookings = bookings.filter(b => b.status !== 'Completed' && b.status !== 'Cancelled' && b.status !== 'Rejected');
  const previousBookings = bookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled' || b.status === 'Rejected');

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await axios.patch('/api/users/profile', {
        name,
        phone,
        addresses: [
          { title: 'Home', street, city, pincode, isDefault: true }
        ]
      });
      showToast('Profile updated successfully!');
      fetchUserProfile();
    } catch (err) {
      showToast('Failed to update profile', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* User Overview Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-md"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{user?.name}</h1>
            <p className="text-xs text-slate-500">{user?.email} • {user?.phone}</p>
            <span className="inline-block mt-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800">
              Customer Account
            </span>
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'upcoming' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('previous')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'previous' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Previous ({previousBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'profile' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Profile & Address
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-900">Upcoming Service Appointments</h3>
          {upcomingBookings.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
              <p className="text-xs text-slate-500">You have no active or upcoming service bookings.</p>
              <Link to="/search" className="inline-block px-4 py-2 bg-sky-600 text-white font-semibold text-xs rounded-xl">
                Browse Services & Book
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map(b => (
                <div key={b._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded">{b.bookingId}</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{b.status}</span>
                    </div>
                    <h4 className="font-bold text-base text-slate-900">{b.serviceName}</h4>
                    <p className="text-xs text-slate-500">
                      Provider: <span className="font-semibold text-slate-800">{b.provider?.businessName}</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      Date: {b.bookingDate} at {b.bookingTime}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 text-base">₹{b.price}</span>
                    <Link
                      to={`/booking/${b._id}`}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl transition-colors"
                    >
                      Track Status
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'previous' && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-900">Completed & Past Bookings</h3>
          {previousBookings.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
              No past bookings recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {previousBookings.map(b => (
                <div key={b._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{b.bookingId}</span>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{b.status}</span>
                    </div>
                    <h4 className="font-bold text-base text-slate-900">{b.serviceName}</h4>
                    <p className="text-xs text-slate-500">Provider: {b.provider?.businessName}</p>
                    <p className="text-xs text-slate-400">Date: {b.bookingDate}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 text-base">₹{b.price}</span>
                    <Link
                      to={`/booking/${b._id}`}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors"
                    >
                      View / Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl space-y-6">
          <h3 className="font-bold text-lg text-slate-900">Manage Personal Info & Address</h3>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Default Address</label>
              <input
                type="text"
                placeholder="Street / Flat"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-medium"
              />
              <input
                type="text"
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-medium"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
