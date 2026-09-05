import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  FolderTree, 
  Wrench, 
  Users, 
  UserCheck, 
  Briefcase, 
  Star, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protected Admin Authorization Check
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-slate-200 rounded-2xl shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">Access Denied</h2>
        <p className="text-xs text-slate-500 font-medium">
          You must be logged in as an Administrator to access the Admin Console.
        </p>
        <Link to="/login" className="inline-block px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-xs hover:bg-emerald-700 transition-colors">
          Go to Login
        </Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Categories', path: '/admin/categories', icon: <FolderTree className="w-4 h-4" /> },
    { label: 'Services', path: '/admin/services', icon: <Wrench className="w-4 h-4" /> },
    { label: 'Providers', path: '/admin/providers', icon: <UserCheck className="w-4 h-4" /> },
    { label: 'Users', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Bookings', path: '/admin/bookings', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Reviews', path: '/admin/reviews', icon: <Star className="w-4 h-4" /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/90 shrink-0 sticky top-0 h-screen z-30 justify-between p-4">
        <div className="space-y-6">
          
          {/* Admin Header Brand */}
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900 leading-none block">
                Local<span className="text-emerald-600">Admin</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Console v2.0</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

        </div>

        {/* Footer Admin Actions */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-emerald-700 p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <span>View Marketplace App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 p-2.5 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex">
          <div className="w-64 bg-white p-4 flex flex-col justify-between h-full space-y-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-extrabold text-slate-900 text-base">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" /> Admin Console
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 mt-4">
                {navItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold transition-colors ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-rose-600 p-2.5 rounded-xl hover:bg-rose-50">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-extrabold text-slate-900 hidden sm:block">Admin Management Portal</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-slate-200/80 transition-colors flex items-center gap-1.5"
            >
              <span>Live App</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
            </Link>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <img
                src={user.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden md:block text-left">
                <span className="text-xs font-extrabold text-slate-900 block leading-tight">{user.name}</span>
                <span className="text-[10px] text-emerald-700 font-bold">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
