import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import PaymentModal from '../components/PaymentModal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Upload, 
  ArrowLeft,
  X
} from 'lucide-react';

export default function BookService() {
  const { providerId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [serviceName, setServiceName] = useState(searchParams.get('service') || '');
  const [description, setDescription] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('02:00 PM');
  const [street, setStreet] = useState(user?.addresses?.[0]?.street || 'Sector 62, Near Electronic City');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || 'Noida');
  const [pincode, setPincode] = useState(user?.addresses?.[0]?.pincode || '201301');
  const [phone, setPhone] = useState(user?.phone || '+91 91234 56789');
  const [price, setPrice] = useState(Number(searchParams.get('price')) || 299);

  // Uploaded images state
  const [images, setImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Payment Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    axios.get(`/api/providers/${providerId}`)
      .then(res => {
        setProvider(res.data.provider);
        if (!serviceName && res.data.provider.servicesOffered?.length > 0) {
          setServiceName(res.data.provider.servicesOffered[0].name);
          setPrice(res.data.provider.servicesOffered[0].price);
        } else if (!serviceName) {
          setServiceName('Standard Inspection & Service');
          setPrice(res.data.provider.startingPrice || 299);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [providerId, user]);

  const handleServiceChange = (e) => {
    const selectedName = e.target.value;
    setServiceName(selectedName);
    const matched = provider?.servicesOffered?.find(s => s.name === selectedName);
    if (matched) {
      setPrice(matched.price);
    }
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
      setImages(prev => [...prev, res.data.url]);
      showToast('Photo uploaded successfully');
    } catch (err) {
      console.error('Image upload failed:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please describe the problem or work required', 'error');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleFinalBookingSubmit = async () => {
    try {
      const res = await axios.post('/api/bookings', {
        providerId,
        serviceName,
        description,
        images,
        bookingDate,
        bookingTime,
        address: { street, city, pincode, phone },
        price
      });

      showToast('Booking created successfully!');
      setShowPaymentModal(false);
      navigate(`/booking/${res.data._id}`);
    } catch (err) {
      console.error('Booking submission failed:', err);
      showToast(err.response?.data?.message || 'Failed to submit booking', 'error');
      setShowPaymentModal(false);
    }
  };

  if (loading || !provider) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading booking form...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Provider Profile
      </button>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">Doorstep Service Booking</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Book Service Appointment</h1>
            <p className="text-xs text-slate-500 mt-0.5 font-semibold">
              Provider: <span className="text-slate-900">{provider.businessName}</span>
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200/80 p-3 rounded-2xl flex items-center gap-3">
            <img
              src={provider.user?.profileImage || provider.coverImage}
              alt={provider.businessName}
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">TOTAL PRICE</span>
              <span className="text-lg font-extrabold text-emerald-700">₹{price}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Select Specific Service
            </label>
            <select
              value={serviceName}
              onChange={handleServiceChange}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-xs font-semibold text-slate-800"
            >
              {provider.servicesOffered && provider.servicesOffered.length > 0 ? (
                provider.servicesOffered.map((s, i) => (
                  <option key={i} value={s.name}>
                    {s.name} — ₹{s.price}
                  </option>
                ))
              ) : (
                <option value="General Inspection & Repair">General Service — ₹{provider.startingPrice}</option>
              )}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center justify-between">
              <span>Description of Problem / Requirements *</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="e.g. Living room AC unit is not cooling properly. Needs deep foam cleaning and leak check."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" /> Preferred Date
              </label>
              <input
                type="date"
                required
                value={bookingDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-xs font-semibold text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" /> Preferred Time Slot
              </label>
              <select
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-xs font-semibold text-slate-800"
              >
                <option value="09:00 AM">09:00 AM - 11:00 AM</option>
                <option value="11:30 AM">11:30 AM - 01:30 PM</option>
                <option value="02:00 PM">02:00 PM - 04:00 PM</option>
                <option value="04:30 PM">04:30 PM - 06:30 PM</option>
                <option value="07:00 PM">07:00 PM - 08:30 PM</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" /> Service Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Street / Flat</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Pincode</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-medium"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              Continue to Confirmation (₹{price})
            </button>
          </div>

        </form>

      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        bookingData={{ serviceName, price }}
        onPaymentSuccess={handleFinalBookingSubmit}
        onClose={() => setShowPaymentModal(false)}
      />

    </div>
  );
}
