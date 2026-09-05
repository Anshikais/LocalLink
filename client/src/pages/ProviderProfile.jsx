import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PluggableMap from '../components/PluggableMap';
import SkeletonLoader from '../components/SkeletonLoader';
import { 
  Star, 
  MapPin, 
  CheckCircle, 
  Clock, 
  Heart, 
  ShieldCheck, 
  PhoneCall, 
  Award, 
  Calendar,
  ChevronRight,
  UserCheck,
  Check,
  ImageIcon
} from 'lucide-react';

export default function ProviderProfile() {
  const { id } = useParams();
  const { user, toggleFavorite } = useAuth();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/providers/${id}`);
        setProvider(res.data.provider);
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error('Failed to fetch provider details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <SkeletonLoader count={1} />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Provider Profile Not Found</h2>
        <Link to="/search" className="inline-block px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl">
          Back to Search
        </Link>
      </div>
    );
  }

  const isFavorite = user?.favorites?.includes(provider._id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        
        {/* Cover Photo */}
        <div className="relative h-64 sm:h-72 bg-slate-900 overflow-hidden">
          <img
            src={provider.coverImage || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1200'}
            alt={provider.businessName}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

          {/* Favorite Toggle */}
          <button
            onClick={() => toggleFavorite(provider._id)}
            className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-slate-700 hover:text-rose-600 shadow-md transition-colors"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Details Banner */}
        <div className="p-6 sm:p-8 -mt-16 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <img
              src={provider.user?.profileImage || provider.coverImage}
              alt={provider.businessName}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
            />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {provider.businessName}
                </h1>
                {provider.verificationStatus === 'approved' && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Verified Pro
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm font-bold text-emerald-700">
                {provider.category?.name} • {provider.experienceYears || 5} Years Experience
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-600 pt-1 font-semibold">
                <span className="flex items-center gap-1 text-slate-900 font-extrabold">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {provider.rating ? provider.rating.toFixed(1) : '5.0'} ({provider.reviewCount || 0} reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  {provider.location?.formattedAddress || provider.location?.city}
                </span>
              </div>
            </div>
          </div>

          {/* Booking CTA Button */}
          <div className="flex items-center gap-4 shrink-0">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Starting Price</span>
              <span className="text-2xl font-extrabold text-slate-900">₹{provider.startingPrice}</span>
            </div>

            <Link
              to={`/book/${provider._id}`}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-all shadow-sm text-xs flex items-center gap-2"
            >
              Book Service <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <h2 className="text-base font-extrabold text-slate-900">About Provider</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {provider.description}
            </p>
          </div>

          {/* Services Offered */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Services & Pricing</h2>
              <p className="text-xs text-slate-500 font-medium">Select a service to book directly</p>
            </div>

            <div className="space-y-3">
              {provider.servicesOffered && provider.servicesOffered.length > 0 ? (
                provider.servicesOffered.map((srv, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">{srv.name}</h4>
                      {srv.description && <p className="text-xs text-slate-500 mt-0.5">{srv.description}</p>}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-extrabold text-slate-900 text-sm">From ₹{srv.price}</span>
                      <Link
                        to={`/book/${provider._id}?service=${encodeURIComponent(srv.name)}&price=${srv.price}`}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 flex items-center justify-between">
                  <span>Standard Inspection & Repair</span>
                  <span className="font-bold text-slate-900">From ₹{provider.startingPrice}</span>
                </div>
              )}
            </div>
          </div>

          {/* Gallery */}
          {provider.gallery && provider.gallery.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" /> Work Gallery
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {provider.gallery.map((img, i) => (
                  <div key={i} className="h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={img} alt={`Work ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">Customer Reviews</h2>
              <span className="text-base font-extrabold text-slate-900 flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                {provider.rating ? provider.rating.toFixed(1) : '5.0'} ({reviews.length})
              </span>
            </div>

            <div className="space-y-3 divide-y divide-slate-100">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">No reviews submitted yet.</p>
              ) : (
                reviews.map(rev => (
                  <div key={rev._id} className="pt-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{rev.customer?.name || 'Customer'}</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, starI) => (
                          <Star key={starI} className={`w-3 h-3 ${starI < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Working Hours & Area
            </h3>

            <div className="space-y-3 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5"><Clock className="w-4 h-4 text-emerald-600" /> Hours</span>
                <span className="text-slate-900">{provider.workingHours || 'Mon-Sat 9AM-7PM'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-600" /> Service Area</span>
                <span className="text-slate-900">Within {provider.serviceAreaRadiusKm || 15} km</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Service Location
            </h3>
            {provider.location?.coordinates && (
              <PluggableMap
                userLat={provider.location.coordinates[1]}
                userLng={provider.location.coordinates[0]}
                providers={[provider]}
                radiusKm={provider.serviceAreaRadiusKm || 15}
                height="220px"
              />
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
