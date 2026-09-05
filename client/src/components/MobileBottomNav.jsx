import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, Briefcase, Heart, User, ShieldCheck } from 'lucide-react';

export default function MobileBottomNav() {
  const { user } = useAuth();

  const getProfilePath = () => {
    if (!user) return '/login';
    if (user.role === 'provider') return '/provider/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/dashboard';
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-sm">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-primary-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/search"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-primary-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Search className="w-5 h-5" />
        <span>Services</span>
      </NavLink>

      <NavLink
        to="/bookings"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-primary-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Briefcase className="w-5 h-5" />
        <span>Bookings</span>
      </NavLink>

      <NavLink
        to="/favorites"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-rose-500 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Heart className="w-5 h-5" />
        <span>Favorites</span>
      </NavLink>

      <NavLink
        to={getProfilePath()}
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-primary-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        {user?.role === 'admin' ? (
          <ShieldCheck className="w-5 h-5" />
        ) : (
          <User className="w-5 h-5" />
        )}
        <span>{user ? (user.role === 'provider' ? 'Provider' : 'Account') : 'Login'}</span>
      </NavLink>
    </div>
  );
}
