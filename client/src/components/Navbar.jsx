import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation as useGeoLocation } from '../context/LocationContext';
import { useNotification } from '../context/NotificationContext';
import { 
  Search, 
  Heart, 
  Bell, 
  User, 
  LogOut, 
  Briefcase, 
  ShieldCheck, 
  ChevronDown, 
  Menu, 
  X,
  Wrench,
  MapPin,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { location, requestBrowserLocation, geoLoading } = useGeoLocation();
  const { notifications, unreadCount, markAllRead } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const navLocation = useLocation();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  const isActivePath = (path) => navLocation.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Logo & Typography */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-xs group-hover:bg-primary-700 transition-colors">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Local<span className="text-primary-600">Service</span>
            </span>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-700">
            <Link 
              to="/search" 
              className={`transition-colors ${
                isActivePath('/search') ? 'text-primary-600 font-bold' : 'hover:text-primary-600'
              }`}
            >
              Services
            </Link>

            <Link 
              to="/search" 
              className="hover:text-primary-600 transition-colors"
            >
              Categories
            </Link>

            <a 
              href="#how-it-works" 
              onClick={(e) => {
                if (navLocation.pathname !== '/') {
                  e.preventDefault();
                  navigate('/#how-it-works');
                }
              }}
              className="hover:text-primary-600 transition-colors"
            >
              How It Works
            </a>
            
            <Link 
              to="/bookings" 
              className={`transition-colors ${
                isActivePath('/bookings') || isActivePath('/dashboard') ? 'text-primary-600 font-bold' : 'hover:text-primary-600'
              }`}
            >
              My Bookings
            </Link>

            <Link 
              to="/favorites" 
              className={`flex items-center gap-1.5 transition-colors relative ${
                isActivePath('/favorites') ? 'text-primary-600 font-bold' : 'hover:text-primary-600'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${user?.favorites?.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              <span>Favorites</span>
              {user?.favorites?.length > 0 && (
                <span className="bg-primary-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {user.favorites.length}
                </span>
              )}
            </Link>
          </div>

          {/* Right: Location & User Controls */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Location Selector Button */}
            <button
              onClick={requestBrowserLocation}
              disabled={geoLoading}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-slate-100/80 text-slate-800 hover:bg-primary-100 hover:text-primary-700 rounded-xl transition-all border border-slate-200/80 shadow-2xs"
              title="Click to detect current location"
            >
              <MapPin className="w-3.5 h-3.5 text-primary-600 shrink-0" />
              <span className="truncate max-w-[110px]">{location.city || 'Lucknow'}</span>
              <span className="text-[10px] font-extrabold text-primary-700 bg-primary-100 px-1.5 py-0.2 rounded ml-0.5">
                {geoLoading ? '...' : 'GPS'}
              </span>
            </button>

            {/* Notification Bell Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                  className="p-2 text-slate-600 hover:text-primary-600 hover:bg-slate-100 rounded-full transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary-600 rounded-full ring-2 ring-white"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
                    <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                      <h4 className="font-bold text-xs text-slate-900">Notifications</h4>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-[11px] text-primary-600 font-bold hover:underline">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                      {notifications.length === 0 ? (
                        <p className="text-slate-500 p-4 text-center text-xs">No new notifications.</p>
                      ) : (
                        notifications.map(n => (
                          <div key={n._id} className={`p-3 ${n.isRead ? 'text-slate-600' : 'bg-primary-50/60 font-semibold text-slate-900'}`}>
                            <p>{n.title}</p>
                            <p className="text-slate-500 font-normal mt-0.5">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Authentication Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-full border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50"
                >
                  <img
                    src={user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-slate-500 text-[11px] truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary-100 text-primary-800">
                        {user.role}
                      </span>
                    </div>

                    {user.role === 'customer' && (
                      <Link to="/dashboard" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 hover:bg-slate-50 font-semibold text-slate-700">
                        Account Dashboard
                      </Link>
                    )}

                    {user.role === 'provider' && (
                      <Link to="/provider/dashboard" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 hover:bg-slate-50 font-semibold text-slate-700">
                        Provider Portal
                      </Link>
                    )}

                    {user.role === 'admin' && (
                      <Link to="/admin/dashboard" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 hover:bg-slate-50 font-semibold text-slate-700">
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 font-bold">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="text-xs font-bold text-slate-700 hover:text-primary-600 px-3.5 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl transition-all shadow-xs"
                >
                  Sign Up
                </Link>
              </div>
            )}

          </div>

          {/* Mobile Hamburger Trigger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => { requestBrowserLocation(); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between text-xs font-bold p-2.5 bg-slate-50 text-slate-800 rounded-xl border border-slate-200"
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary-600" />
              <span>Location: {location.city || 'Lucknow'}</span>
            </span>
            <span className="text-[10px] font-extrabold text-primary-700 bg-primary-100 px-2 py-0.5 rounded">GPS</span>
          </button>

          <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="block text-slate-800 font-bold py-2 text-xs">
            Services & Categories
          </Link>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-slate-800 font-bold py-2 text-xs">
            How It Works
          </a>
          <Link to="/bookings" onClick={() => setMobileMenuOpen(false)} className="block text-slate-800 font-bold py-2 text-xs">
            My Bookings
          </Link>
          <Link to="/favorites" onClick={() => setMobileMenuOpen(false)} className="block text-slate-800 font-bold py-2 text-xs">
            Favorites ({user?.favorites?.length || 0})
          </Link>

          {!user ? (
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-1/2 text-center font-bold py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800">Login</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-1/2 text-center font-bold py-2.5 rounded-xl bg-primary-600 text-white text-xs">Sign Up</Link>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-primary-600 text-xs py-1">
                  Admin Dashboard
                </Link>
              )}
              {user.role === 'provider' && (
                <Link to="/provider/dashboard" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-primary-600 text-xs py-1">
                  Provider Dashboard
                </Link>
              )}
              <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="w-full text-left font-bold text-rose-600 py-1.5 text-xs">
                Sign Out ({user.name})
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
