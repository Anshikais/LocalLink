import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Star, MapPin, CheckCircle, Heart, Clock, Award, ArrowRight } from 'lucide-react';
import { getProviderServiceImage, getProviderAvatar } from '../utils/imageUtils';

export default function ProviderCard({ provider }) {
  const { user, toggleFavorite } = useAuth();
  const navigate = useNavigate();

  const isFavorite = user?.favorites?.includes(provider._id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    toggleFavorite(provider._id);
  };

  const coverImageUrl = getProviderServiceImage(provider);
  const avatarUrl = getProviderAvatar(provider);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-primary-300 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      
      <div>
        {/* Header Cover Image */}
        <div className="relative h-44 overflow-hidden bg-slate-100">
          <img
            src={coverImageUrl}
            alt={provider.businessName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20"></div>

          {/* Favorite Heart Trigger */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-700 hover:text-rose-600 shadow-xs transition-colors"
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Featured Badge */}
          {provider.isFeatured && (
            <span className="absolute top-3 left-3 bg-primary-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              <Award className="w-3 h-3" /> Featured
            </span>
          )}

          {/* Avatar & Title Banner Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end gap-3">
            <div className="relative shrink-0">
              <img
                src={avatarUrl}
                alt={provider.businessName}
                className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs bg-white"
              />
              {provider.verificationStatus === 'approved' && (
                <div className="absolute -bottom-1 -right-1 bg-primary-600 text-white p-0.5 rounded-full ring-2 ring-white" title="Verified Provider">
                  <CheckCircle className="w-3 h-3 fill-primary-600 text-white" />
                </div>
              )}
            </div>

            <div className="text-white min-w-0 flex-1 drop-shadow-xs">
              <h3 className="font-extrabold text-base text-white truncate leading-tight">
                {provider.businessName}
              </h3>
              <p className="text-xs text-primary-100 font-semibold truncate mt-0.5">
                {provider.category?.name || 'Local Service Pro'}
              </p>
            </div>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-4 space-y-3">
          
          {/* Rating ⭐ (GOLD/AMBER), Reviews & Experience */}
          <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-1.5 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/50">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-extrabold text-slate-900">{provider.rating ? provider.rating.toFixed(1) : '5.0'}</span>
              <span className="text-slate-500 text-[11px]">({provider.reviewCount || 0} reviews)</span>
            </div>

            <span className="text-slate-500 font-semibold text-[11px]">
              {provider.experienceYears || 3} yrs exp.
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {provider.description}
          </p>

          {/* Location & Availability Badges */}
          <div className="flex items-center justify-between gap-2 text-xs pt-0.5">
            <div className="flex items-center gap-1 font-semibold text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-primary-600 shrink-0" />
              <span>
                {provider.distanceKm !== undefined ? `${provider.distanceKm} km away` : (provider.location?.city || 'Nearby')}
              </span>
            </div>

            {provider.isAvailable ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-primary-800 bg-primary-100 px-2 py-0.5 rounded-md border border-primary-200">
                <Clock className="w-3 h-3 text-primary-600" /> Available Today
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                Busy
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-4 pt-0 bg-white">
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Starting Price</span>
            <span className="text-lg font-extrabold text-slate-900">
              ₹{provider.startingPrice}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/providers/${provider._id}`}
              className="text-xs font-bold px-3 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Profile
            </Link>
            <Link
              to={`/book/${provider._id}`}
              className="text-xs font-bold px-3.5 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-xs flex items-center gap-1"
            >
              Book Now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
