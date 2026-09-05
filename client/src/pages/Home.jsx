import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from '../context/LocationContext';
import ProviderCard from '../components/ProviderCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { 
  Search, 
  MapPin, 
  Wrench, 
  Zap, 
  Wind, 
  Sparkles, 
  Tv, 
  Scissors, 
  BookOpen, 
  Car, 
  Paintbrush, 
  Hammer,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [topProviders, setTopProviders] = useState([]);
  const [loading, setLoading] = useState(true);
 const { location, requestBrowserLocation, geoLoading, geoError } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, provRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/providers?sortBy=recommended&lat=' + location.latitude + '&lng=' + location.longitude)
        ]);
        setCategories(catRes.data);
        setTopProviders(provRes.data.slice(0, 6));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.latitude, location.longitude]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  // Pastel themes for category icons
  const getCategoryTheme = (iconName) => {
    switch (iconName) {
      case 'Wrench': 
        return { bg: 'bg-emerald-50/90 text-emerald-600 border-emerald-100', icon: <Wrench className="w-5 h-5" /> };
      case 'Zap': 
        return { bg: 'bg-amber-50/90 text-amber-600 border-amber-100', icon: <Zap className="w-5 h-5" /> };
      case 'Wind': 
        return { bg: 'bg-cyan-50/90 text-cyan-600 border-cyan-100', icon: <Wind className="w-5 h-5" /> };
      case 'Sparkles': 
        return { bg: 'bg-teal-50/90 text-teal-600 border-teal-100', icon: <Sparkles className="w-5 h-5" /> };
      case 'Tv': 
        return { bg: 'bg-purple-50/90 text-purple-600 border-purple-100', icon: <Tv className="w-5 h-5" /> };
      case 'Scissors': 
        return { bg: 'bg-rose-50/90 text-rose-600 border-rose-100', icon: <Scissors className="w-5 h-5" /> };
      case 'BookOpen': 
        return { bg: 'bg-blue-50/90 text-blue-600 border-blue-100', icon: <BookOpen className="w-5 h-5" /> };
      case 'Car': 
        return { bg: 'bg-sky-50/90 text-sky-600 border-sky-100', icon: <Car className="w-5 h-5" /> };
      case 'Paintbrush': 
        return { bg: 'bg-indigo-50/90 text-indigo-600 border-indigo-100', icon: <Paintbrush className="w-5 h-5" /> };
      default: 
        return { bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: <Hammer className="w-5 h-5" /> };
    }
  };

  const popularPills = [
    'Plumber', 'Electrician', 'AC Repair', 'Home Cleaning', 
    'Tutor', 'Salon', 'Carpenter', 'Mechanic'
  ];

  return (
    <div className="space-y-10 sm:space-y-12 pb-12 bg-slate-50/40">
      
      {/* 1. Compact White Hero Section */}
      <section className="bg-white border-b border-slate-200/80 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-5">
            
            {/* Verified Badge */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-3 py-0.5 rounded-full text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified Local Professionals</span>
            </div>

            {/* Hero Heading */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Find trusted professionals <span className="text-emerald-600">near you</span>
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto font-medium leading-relaxed">
              Book reliable local experts for plumbing, electrical, cleaning, AC repair and home services.
            </p>

            {/* Premium Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200/90 flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all"
            >
              {/* Service Input */}
              <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-slate-200/80">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Location Selector */}
              <div className="flex items-center gap-2 px-3 py-2 w-full sm:w-1/2 justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {location.city || 'Noida NCR'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={requestBrowserLocation}
                  disabled={geoLoading}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg shrink-0 transition-colors border border-emerald-200/60"
                >
                  {geoLoading ? 'Detecting...' : 'Use location'}
                </button>
                {geoError && (
  <p className="text-xs text-red-500 mt-1">
    {geoError}
  </p>
)}
              </div>

              {/* Green Search Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shrink-0 flex items-center justify-center gap-2 text-xs shadow-xs"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </form>

            {/* Popular Service Searches Pills */}
            <div className="pt-1 flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <span className="text-slate-500 font-semibold mr-1">Popular:</span>
              {popularPills.map(pill => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => navigate(`/search?search=${encodeURIComponent(pill)}`)}
                  className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 px-3 py-1 rounded-lg border border-slate-200/70 transition-colors text-xs font-medium"
                >
                  {pill}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 2. Browse by Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Browse by category</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Explore services by specialty</p>
          </div>
          <Link
            to="/search"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            All categories <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {categories.map((cat) => {
            const theme = getCategoryTheme(cat.icon);
            return (
              <Link
                key={cat._id}
                to={`/search?category=${cat.slug}`}
                className="group bg-white p-4 rounded-xl border border-slate-200/90 hover:border-emerald-300/90 shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-start space-y-2.5"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${theme.bg}`}>
                  {theme.icon}
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-medium">
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Services Near You Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Services near you</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Top-rated local professionals available in your radius</p>
          </div>
          <Link
            to="/search"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            View all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader count={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topProviders.map((provider) => (
              <ProviderCard key={provider._id} provider={provider} />
            ))}
          </div>
        )}
      </section>

      {/* 4. How LocalService Works Section */}
      <section id="how-it-works" className="bg-white border-y border-slate-200/80 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-md mx-auto space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">How LocalService works</h2>
            <p className="text-xs text-slate-500 font-medium">Book trusted experts in 4 simple steps</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200/80 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-xs">
                1
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">1. Search</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Find the service you need near your location with instant filter options.
              </p>
            </div>

            <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200/80 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-xs">
                2
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">2. Compare</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Compare nearby professionals, upfront starting prices, ratings and reviews.
              </p>
            </div>

            <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200/80 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-xs">
                3
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">3. Book</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Choose your provider, preferred date, time slot, and request a doorstep service.
              </p>
            </div>

            <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200/80 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-xs">
                4
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">4. Get It Done</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Track your booking status live, complete the job, and leave a provider review.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Light Mint Provider CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200/80">
              For Service Professionals
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Grow your local service business
            </h2>
            <p className="text-slate-600 text-xs font-medium leading-relaxed">
              Register as a verified professional on LocalService, reach local customers, and receive booking requests directly.
            </p>
          </div>
          <Link
            to="/register-provider"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors text-xs shrink-0 flex items-center gap-2 shadow-xs"
          >
            Become a Provider <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
