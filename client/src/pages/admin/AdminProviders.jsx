import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SkeletonLoader from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Upload, 
  MapPin, 
  Star, 
  CheckCircle, 
  XCircle, 
  Award, 
  Clock, 
  X, 
  Navigation,
  Check
} from 'lucide-react';

export default function AdminProviders() {
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('provider123');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [experienceYears, setExperienceYears] = useState(3);
  const [startingPrice, setStartingPrice] = useState(299);
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1000');
  
  // Location Form State
  const [formattedAddress, setFormattedAddress] = useState('Sector 62, Noida');
  const [city, setCity] = useState('Noida');
  const [state, setState] = useState('Uttar Pradesh');
  const [latitude, setLatitude] = useState(28.6270);
  const [longitude, setLongitude] = useState(77.3726);
  const [serviceAreaRadiusKm, setServiceAreaRadiusKm] = useState(15);
  
  const [isAvailable, setIsAvailable] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('approved');
  const [isFeatured, setIsFeatured] = useState(false);
  const [rating, setRating] = useState(5.0);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const [provRes, catRes] = await Promise.all([
        axios.get(`/api/admin/providers?status=${statusFilter}&category=${categoryFilter}&search=${searchQuery}`),
        axios.get('/api/categories')
      ]);
      setProviders(provRes.data.providers || provRes.data);
      setCategories(catRes.data);
      if (catRes.data.length > 0 && !categoryId) {
        setCategoryId(catRes.data[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch providers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProviders();
  };

  const openAddModal = () => {
    setEditingProvider(null);
    setName('');
    setEmail('');
    setPhone('+91 98765 43210');
    setPassword('provider123');
    setBusinessName('');
    setDescription('');
    if (categories.length > 0) setCategoryId(categories[0]._id);
    setExperienceYears(3);
    setStartingPrice(299);
    setCoverImage('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1000');
    setFormattedAddress('Sector 62, Noida');
    setCity('Noida');
    setState('Uttar Pradesh');
    setLatitude(28.6270);
    setLongitude(77.3726);
    setServiceAreaRadiusKm(15);
    setIsAvailable(true);
    setVerificationStatus('approved');
    setIsFeatured(false);
    setRating(5.0);
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProvider(p);
    setName(p.user?.name || p.businessName);
    setEmail(p.user?.email || '');
    setPhone(p.user?.phone || '');
    setPassword('');
    setBusinessName(p.businessName);
    setDescription(p.description);
    setCategoryId(p.category?._id || p.category);
    setExperienceYears(p.experienceYears);
    setStartingPrice(p.startingPrice);
    setCoverImage(p.coverImage);
    setFormattedAddress(p.location?.formattedAddress || '');
    setCity(p.location?.city || '');
    setState(p.location?.state || '');
    setLongitude(p.location?.coordinates ? p.location.coordinates[0] : 77.3726);
    setLatitude(p.location?.coordinates ? p.location.coordinates[1] : 28.6270);
    setServiceAreaRadiusKm(p.serviceAreaRadiusKm || 15);
    setIsAvailable(p.isAvailable !== false);
    setVerificationStatus(p.verificationStatus || 'approved');
    setIsFeatured(p.isFeatured === true);
    setRating(p.rating || 5.0);
    setIsModalOpen(true);
  };

  const detectBrowserLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser geolocation is not supported.');
      return;
    }
    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(Number(pos.coords.latitude.toFixed(6)));
        setLongitude(Number(pos.coords.longitude.toFixed(6)));
        setFormattedAddress(`Detected Location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        setDetectingGps(false);
      },
      (err) => {
        alert(`Location detection failed: ${err.message}`);
        setDetectingGps(false);
      }
    );
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCoverImage(res.data.url);
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        email,
        phone,
        password: password || 'provider123',
        businessName,
        description,
        category: categoryId,
        experienceYears,
        startingPrice,
        coverImage,
        formattedAddress,
        city,
        state,
        latitude,
        longitude,
        serviceAreaRadiusKm,
        isAvailable,
        verificationStatus,
        isFeatured,
        rating
      };

      if (editingProvider) {
        await axios.patch(`/api/admin/providers/${editingProvider._id}`, payload);
      } else {
        await axios.post('/api/admin/providers', payload);
      }
      setIsModalOpen(false);
      fetchProviders();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving provider');
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`/api/admin/providers/${id}/approve`);
      fetchProviders();
    } catch (err) {
      alert(err.response?.data?.message || 'Error approving provider');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (reason === null) return;
    try {
      await axios.patch(`/api/admin/providers/${id}/reject`, { reason });
      fetchProviders();
    } catch (err) {
      alert(err.response?.data?.message || 'Error rejecting provider');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await axios.patch(`/api/admin/providers/${id}/featured`);
      fetchProviders();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating featured status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this provider record?')) return;
    try {
      await axios.delete(`/api/admin/providers/${id}`);
      fetchProviders();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting provider');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Provider Management</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage provider profiles, locations, GeoJSON coordinates, and verification approvals.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Provider
        </button>
      </div>

      {/* Filters Bar */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search business name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200/90 pl-10 pr-4 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white border border-slate-200/90 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="">All Verification Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending Review</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-white border border-slate-200/90 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      </form>

      {/* Provider Table */}
      {loading ? (
        <SkeletonLoader count={4} />
      ) : providers.length === 0 ? (
        <EmptyState title="No providers found" message="Add a provider to populate your directory." />
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                  <th className="p-4">Provider</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {providers.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.user?.profileImage || p.coverImage} alt={p.businessName} className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-slate-900">{p.businessName}</h4>
                            {p.isFeatured && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <Award className="w-3 h-3 text-amber-600" /> Featured
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {p.user?.name || 'Owner'} • {p.user?.email || p.user?.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-700">
                      {p.category?.name || 'Unassigned'}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 text-slate-700 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{p.location?.city || 'Noida NCR'}</span>
                        <span className="text-[11px] text-slate-400">({p.serviceAreaRadiusKm || 15} km)</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{p.rating ? p.rating.toFixed(1) : '5.0'}</span>
                        <span className="text-[11px] text-slate-400 font-normal">({p.reviewCount || 0})</span>
                      </div>
                    </td>

                    <td className="p-4 font-extrabold text-slate-900">
                      ₹{p.startingPrice}
                    </td>

                    <td className="p-4">
                      {p.verificationStatus === 'approved' ? (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                          Approved
                        </span>
                      ) : p.verificationStatus === 'pending' ? (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                          Pending
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                          Rejected
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {p.verificationStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(p._id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(p._id)}
                              className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-[11px] rounded-lg transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleToggleFeatured(p._id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            p.isFeatured ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                          }`}
                          title="Toggle Featured"
                        >
                          <Award className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Provider"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Provider"
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

      {/* Provider Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-6 animate-in fade-in max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingProvider ? 'Edit Provider Profile' : 'Add New Provider Account'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 uppercase tracking-wider block">Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Electrical Services"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 uppercase tracking-wider block">Owner Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 uppercase tracking-wider block">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="provider@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 uppercase tracking-wider block">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 uppercase tracking-wider block">Category *</label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold text-slate-800"
                  >
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 uppercase tracking-wider block">Experience (Yrs)</label>
                  <input
                    type="number"
                    min="0"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 uppercase tracking-wider block">Starting Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 uppercase tracking-wider block">Business Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary of services offered, certifications, and experience..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-900"
                />
              </div>

              {/* LOCATION MANAGER SECTION */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" /> Location & Service Radius Manager
                  </h4>
                  <button
                    type="button"
                    onClick={detectBrowserLocation}
                    disabled={detectingGps}
                    className="text-[11px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Navigation className="w-3 h-3 text-emerald-600" />
                    {detectingGps ? 'Detecting GPS...' : 'Use Browser GPS Location'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Formatted Address</label>
                    <input
                      type="text"
                      value={formattedAddress}
                      onChange={(e) => setFormattedAddress(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Service Radius (km)</label>
                    <input
                      type="number"
                      value={serviceAreaRadiusKm}
                      onChange={(e) => setServiceAreaRadiusKm(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* Status Controls */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 uppercase tracking-wider block">Verification Status</label>
                  <select
                    value={verificationStatus}
                    onChange={(e) => setVerificationStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold text-slate-800"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending Review</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 uppercase tracking-wider block">Cover Image (Cloudinary)</label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{uploadingImage ? '...' : 'Upload'}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Available</span>
                  </label>

                  <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-amber-800 font-extrabold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> Featured
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  {editingProvider ? 'Save Changes' : 'Create Provider'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
