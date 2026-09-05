import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from '../context/LocationContext';
import ProviderCard from '../components/ProviderCard';
import PluggableMap from '../components/PluggableMap';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { 
  Search as SearchIcon, 
  MapPin, 
  Filter, 
  SlidersHorizontal, 
  LayoutGrid, 
  Map as MapIcon, 
  Star, 
  CheckCircle, 
  Clock, 
  X
} from 'lucide-react';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { location, requestBrowserLocation, updateRadius, geoLoading } = useLocation();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [radius, setRadius] = useState(searchParams.get('radius') || location.radiusKm || 20);
  const [minRating, setMinRating] = useState(searchParams.get('rating') || 0);
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verified') === 'true');
  const [availableOnly, setAvailableOnly] = useState(searchParams.get('available') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'recommended');
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/categories').then(res => setCategories(res.data)).catch(console.error);
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (location.latitude && location.longitude) {
        params.append('lat', location.latitude);
        params.append('lng', location.longitude);
      }
      params.append('radius', radius);
      if (minRating > 0) params.append('minRating', minRating);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (verifiedOnly) params.append('verifiedOnly', 'true');
      if (availableOnly) params.append('availableOnly', 'true');
      params.append('sortBy', sortBy);

      const res = await axios.get(`/api/providers?${params.toString()}`);
      setProviders(res.data);
    } catch (err) {
      console.error('Failed to fetch providers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [searchQuery, selectedCategory, radius, minRating, maxPrice, verifiedOnly, availableOnly, sortBy, location.latitude, location.longitude]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setRadius(20);
    setMinRating(0);
    setMaxPrice('');
    setVerifiedOnly(false);
    setAvailableOnly(false);
    setSortBy('recommended');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Search Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Search Services</h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Showing local service providers near <span className="font-bold text-slate-800">{location.city || 'Lucknow'}</span> within {radius} km.
            </p>
          </div>

          <button
            onClick={requestBrowserLocation}
            disabled={geoLoading}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-primary-100 text-primary-800 hover:bg-primary-200 rounded-xl border border-primary-200/80 transition-colors shrink-0 self-start sm:self-auto"
          >
            <MapPin className="w-4 h-4 text-primary-600" />
            {geoLoading ? 'Detecting...' : 'Use location'}
          </button>
        </div>

        {/* Input & Sorting Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
          
          <div className="md:col-span-8 relative">
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by service name, electrician, plumber, AC repair..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="rating">Sort: Highest Rating</option>
              <option value="distance">Sort: Nearest Distance</option>
              <option value="price">Sort: Starting Price</option>
              <option value="reviews">Sort: Most Reviewed</option>
            </select>

            {/* Grid vs Map View Toggle */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center shrink-0 border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'map' ? 'bg-white text-primary-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Map View"
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid & Filters Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Filters */}
        <aside className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6 sticky top-20">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary-600" /> Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-xs text-rose-600 hover:underline font-bold"
            >
              Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c._id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Radius Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="uppercase tracking-wider">Search Radius</span>
              <span className="text-primary-800 bg-primary-100 px-2 py-0.5 rounded border border-primary-200">{radius} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={radius}
              onChange={(e) => {
                setRadius(e.target.value);
                updateRadius(e.target.value);
              }}
              className="w-full accent-primary-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>1 km</span>
              <span>10 km</span>
              <span>25 km</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Min Rating</label>
            <div className="flex items-center gap-1.5">
              {[0, 3, 4, 4.5].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setMinRating(r)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center gap-0.5 ${
                    minRating == r 
                      ? 'bg-primary-600 text-white border-primary-600 shadow-xs' 
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r === 0 ? 'Any' : `${r}★`}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Max Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
              <input
                type="number"
                placeholder="e.g. 500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 pl-7 pr-3 py-2 rounded-xl text-xs font-semibold text-slate-800"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-primary-600" /> Verified Providers
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Available Today
              </span>
            </label>
          </div>

        </aside>

        {/* Results Grid */}
        <main className="md:col-span-3 space-y-6">
          {loading ? (
            <SkeletonLoader count={6} />
          ) : providers.length === 0 ? (
            <EmptyState
              title="No providers found."
              message="Try increasing your search radius or selecting another category."
              actionText="Reset Filters"
              onAction={clearFilters}
            />
          ) : viewMode === 'map' ? (
            <div className="space-y-4">
              <PluggableMap
                userLat={location.latitude}
                userLng={location.longitude}
                providers={providers}
                radiusKm={radius}
                height="550px"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map(provider => (
                <ProviderCard key={provider._id} provider={provider} />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
