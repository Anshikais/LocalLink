import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from '../context/LocationContext';
import ProviderCard from '../components/ProviderCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { Search, MapPin, Wrench,Zap, Wind,Sparkles,Tv,Scissors,BookOpen, Car, Paintbrush, Hammer, ShieldCheck, ArrowRight, CheckCircle2, SlidersHorizontal, ThumbsUp, Clock, Award, Users, Building2,
  MessageSquare} from 'lucide-react';
export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [topProviders, setTopProviders] = useState([]);
  const [radius, setRadius] = useState(20);
  const [loading, setLoading] = useState(true);
  const {  location, requestBrowserLocation,  geoLoading,  geoError} = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const latitude = location?.latitude;
        const longitude = location?.longitude;
        let categoriesData = [];
        try {
          const catRes = await axios.get('/api/categories');
          console.log('Categories API response:', catRes.data);
          if (Array.isArray(catRes.data)) {
            categoriesData = catRes.data;
          } else if (Array.isArray(catRes.data?.categories)) {
            categoriesData = catRes.data.categories;
          } else {
            categoriesData = [];
          }
        } catch (categoryError) {
          console.error(
            'Failed to load categories:',
            categoryError.response?.data || categoryError.message
          );
        }
        let providersData = [];
        try {
          const providerUrl =
            `/api/providers?sortBy=recommended` +
            `&lat=${latitude ?? ''}` +
            `&lng=${longitude ?? ''}` +
           `&radius=${radius}`;
          console.log('Provider API URL:', providerUrl);
          const provRes = await axios.get(providerUrl);
          console.log('Providers API response:', provRes.data);
          if (Array.isArray(provRes.data)) {
            providersData = provRes.data;
          } else if (Array.isArray(provRes.data?.providers)) {
            providersData = provRes.data.providers;
          } else {
            providersData = [];
          }
        } catch (providerError) {
          console.error(
            'Failed to load providers:',
            providerError.response?.data || providerError.message
          );
        }
        setCategories(categoriesData);
        setTopProviders(providersData);
      } catch (error) {
        console.error(
          'Failed to load homepage data:',
          error.response?.data || error.message
        );
        setCategories([]);
        setTopProviders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [
    location?.latitude,
    location?.longitude,
    radius
  ]);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(
        `/search?search=${encodeURIComponent(searchQuery.trim())}`
      );
    } else {
      navigate('/search');
    }
  };
  const handleExpandRadius = () => {
    if (radius < 25) {
      setRadius(25);
    } else if (radius < 50) {
      setRadius(50);
    } else {
      setRadius(100);
    }
  };
  const getCategoryTheme = (iconName) => {
    switch (iconName) {
      case 'Wrench':
        return {
          bg: 'bg-primary-100 text-primary-600 border-primary-200',
          icon: <Wrench className="w-5 h-5" />
        };
      case 'Zap':
        return {
          bg: 'bg-amber-50 text-amber-600 border-amber-100',
          icon: <Zap className="w-5 h-5" />
        };
      case 'Wind':
        return {
          bg: 'bg-sky-50 text-sky-600 border-sky-100',
          icon: <Wind className="w-5 h-5" />
        };
      case 'Sparkles':
        return {
          bg: 'bg-primary-50 text-primary-600 border-primary-200',
          icon: <Sparkles className="w-5 h-5" />
        };
      case 'Tv':
        return {
          bg: 'bg-purple-50 text-purple-600 border-purple-100',
          icon: <Tv className="w-5 h-5" />
        };
      case 'Scissors':
        return {
          bg: 'bg-rose-50 text-rose-600 border-rose-100',
          icon: <Scissors className="w-5 h-5" />
        };
      case 'BookOpen':
        return {
          bg: 'bg-blue-50 text-blue-600 border-blue-100',
          icon: <BookOpen className="w-5 h-5" />
        };
      case 'Car':
        return {
          bg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
          icon: <Car className="w-5 h-5" />
        };
      case 'Paintbrush':
        return {
          bg: 'bg-blue-50 text-primary-600 border-blue-100',
          icon: <Paintbrush className="w-5 h-5" />
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: <Hammer className="w-5 h-5" />
        };
    }
  };
  const popularPills = [
    'Plumber', 'Electrician', 'AC Repair','Home Cleaning','Tutor','Salon','Carpenter','Mechanic',
    'Pest Control','RO Repair' ];
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/*   1. HERO SECTION */}
      <section className="bg-white border-b border-slate-200/80 pt-8 pb-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* LEFT SIDE */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Verification Badge */}
              <div className="inline-flex items-center gap-1.5 bg-primary-100 border border-primary-200 text-primary-800 px-3.5 py-1 rounded-full text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0" />
                <span>
                  Verified Local Professionals
                </span>
              </div>
              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Find trusted professionals
                <br className="hidden sm:inline" />
                <span className="text-primary-600">
                  near you
                </span>
              </h1>
              {/* Description */}
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl font-medium leading-relaxed">
                Book reliable local experts for plumbing,
                electrical, cleaning, AC repair and other
                doorstep home services.
              </p>
              {/* SEARCH BOX */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white p-2 rounded-2xl shadow-lg border border-slate-200/90 flex flex-col sm:flex-row items-center gap-2 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all"
              >
                {/* SERVICE SEARCH */}
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-slate-200/80">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="e.g. AC repair, plumber, electrician"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 font-semibold placeholder-slate-400 focus:outline-none"
                 />
                </div>
                {/* LOCATION */}
                <div className="flex items-center gap-2 px-3.5 py-2.5 w-full sm:w-1/2 justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {location?.city || 'Lucknow'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={requestBrowserLocation}
                    disabled={geoLoading}
                    className="text-[11px] font-bold text-primary-800 hover:text-primary-900 bg-primary-100 hover:bg-primary-200 px-2.5 py-1 rounded-lg shrink-0 transition-colors border border-primary-200/80"
                  >
                    {geoLoading
                      ? 'Detecting...'
                      : 'Use location'}
                  </button>
                </div>
                {/* SEARCH BUTTON */}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shrink-0 flex items-center justify-center gap-2 text-xs shadow-xs"
                >
                  <Search className="w-4 h-4" />
                  <span>
                    Search
                  </span>
                </button>
              </form>
              {/* LOCATION ERROR */}
              {geoError && (
                <p className="text-xs text-rose-500 font-medium">
                  {geoError}
                </p>
              )}
              {/* POPULAR SERVICES */}
              <div className="pt-1 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-bold mr-1">
                  Popular:
                </span>
                {popularPills.map((pill) => (
                  <button
                    key={pill}
                    type="button"
                    onClick={() =>
                      navigate(
                        `/search?search=${encodeURIComponent(pill)}`
                      )
                    }
                    className="bg-slate-100 hover:bg-primary-100 hover:text-primary-700 hover:border-primary-200 text-slate-700 px-3 py-1 rounded-xl border border-slate-200/70 transition-colors text-xs font-semibold"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>
            {/* RIGHT SIDE IMAGE */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-100 aspect-[4/3] lg:aspect-[1/1] max-w-lg mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1000"
                  alt="Verified Local Professional"
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                {/* FLOATING RATING */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-extrabold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900">
                        4.9 ★ Top Rated Pros
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        210+ Verified doorstep reviews
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-primary-800 bg-primary-100 border border-primary-200 px-2 py-1 rounded-lg shrink-0">
                    Guaranteed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*  2. TRUST / STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
            {/* PROFESSIONALS */}
            <div className="pt-2 sm:pt-0 space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                <Users className="w-6 h-6 text-primary-600" />
                <span>
                  30+
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">
                Verified Local Professionals
              </p>
            </div>
            {/* CATEGORIES */}
            <div className="pt-4 sm:pt-0 space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                <Building2 className="w-6 h-6 text-primary-600" />
                <span>
                  {categories.length || 12}
               </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">
                Doorstep Service Categories
              </p>
            </div>
            {/* REVIEWS */}
            <div className="pt-4 sm:pt-0 space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                <MessageSquare className="w-6 h-6 text-primary-600" />
                <span>
                  210+
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">
                Verified Customer Reviews
              </p>
            </div>
          </div>
        </div>
      </section>
      {/*  3. BROWSE BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Browse by category
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Explore popular doorstep services near you
            </p>
          </div>
          <Link
            to="/search"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
          >
            All categories
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {/* CATEGORY LOADING */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <p className="text-sm font-semibold text-slate-500">
              No service categories available.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Please check that the categories API is running.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {categories.slice(0, 10).map((cat) => {
              const theme = getCategoryTheme(cat.icon);
              return (
                <Link
                  key={cat._id}
                  to={`/search?category=${cat.slug}`}
                  className="group bg-white p-4 rounded-2xl border border-slate-200/90 hover:border-primary-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-start space-y-3"
                >
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center ${theme.bg}`}
                  >
                    {theme.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-primary-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-medium">
                      {cat.description || 'Professional local service'}
                    </p>    </div> </Link>
              );
            })}
          </div>
        )}
      </section>
      {/*  4. SERVICES NEAR YOU*/}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Services near you
              </h2>
              <span className="bg-primary-100 text-primary-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-primary-200">
                {location?.city || 'Lucknow'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Top-rated local professionals available in your area ({radius} km radius)
            </p>
          </div>
          <Link   to="/search"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group self-start sm:self-auto"
          >  View all
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {/* LOW RESULTS */}
        {!loading && topProviders.length < 6 && (
          <div className="bg-primary-100/80 border border-primary-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-800">
              <SlidersHorizontal className="w-4 h-4 text-primary-600 shrink-0" />
              <span>
                Only <strong>{topProviders.length}</strong> verified professional
                {topProviders.length !== 1 ? 's' : ''} found within{' '}
                <strong>
                  {radius} km
                </strong>{' '} in {location?.city || 'your location'}.
              </span>
            </div>
            {radius < 50 && (
              <button
                onClick={handleExpandRadius}
                className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors text-xs shrink-0 flex items-center gap-1 shadow-2xs"
              >
                Expand radius to{' '}
                {radius < 25 ? '25' : '50'} km
              </button>
            )}
          </div>
        )}
        {/* PROVIDERS */}
        {loading ? (
          <SkeletonLoader count={6} />
        ) : topProviders.length === 0 ? (
          <EmptyState
            title="No professionals found nearby"
            description="Try increasing your search radius or choosing another service category."
            actionText="Expand Radius to 50 km"
            onAction={() => setRadius(50)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topProviders.slice(0, 8).map((provider) => (
              <ProviderCard
                key={provider._id}
                provider={provider}
              />
            ))}
          </div>
        )}
      </section>
      {/*    5. HOW LOCAL SERVICE WORKS */}
      <section
        id="how-it-works"
        className="bg-white border-y border-slate-200/80 py-12 sm:py-16 mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-md mx-auto space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              How LocalService works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Book trusted experts in 4 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* STEP 1 */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-2.5 hover:border-primary-300 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-800 font-extrabold flex items-center justify-center text-xs">    1  </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
                1. Search Service
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Enter your service requirement or browse categories near your doorstep location.
              </p>
            </div>
 {/* STEP 2 */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-2.5 hover:border-primary-300 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-800 font-extrabold flex items-center justify-center text-xs">  2  </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
                2. Compare Pros
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Compare verified local experts, transparent starting prices, customer ratings and distance. </p>
            </div>
            {/* STEP 3 */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-2.5 hover:border-primary-300 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-800 font-extrabold flex items-center justify-center text-xs">  3
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
                3. Direct Booking </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Select your preferred professional, date, time slot, and request doorstep service.
             </p>
            </div>
            {/* STEP 4 */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-2.5 hover:border-primary-300 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-800 font-extrabold flex items-center justify-center text-xs">    4
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
                4. Job Completed   </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Track status live, complete the job at transparent rates, and leave your honest review.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/*  6. WHY CHOOSE LOCALSERVICE  */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-6">
        <div className="text-center max-w-md mx-auto space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Why choose LocalService
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Your trusted local marketplace for quality service
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* VERIFIED */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
              Verified Professionals
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Every provider undergoes identity, skill, and background verification before joining.
            </p>
          </div>
          {/* PRICING */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
              Transparent Pricing
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Clear starting prices upfront with no hidden surcharges or surprise estimates.
            </p>
          </div>
          {/* NEARBY */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
              Nearby & Prompt
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Real-time radius filtering ensures technicians arrive quickly at your doorstep.
            </p>
          </div>
          {/* REVIEWS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <ThumbsUp className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
              Trusted Reviews
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              100% authentic customer ratings and feedback after verified service completion.
            </p>
          </div>
        </div>
      </section>
      {/* 7. PROVIDER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-primary-100/90 border border-primary-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-primary-200 text-primary-900 px-2.5 py-0.5 rounded-md border border-primary-300">
              For Service Professionals
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Grow your local service business
            </h2>
            <p className="text-slate-600 text-xs font-medium leading-relaxed">
              Register as a verified professional on LocalService, reach local customers in your city, and manage your booking requests directly.
            </p>
          </div>
          <Link
            to="/register-provider"
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors text-xs shrink-0 flex items-center gap-2 shadow-xs"
          >
            Become a Provider
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}