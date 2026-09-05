import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';

// Public & Customer Pages
import Home from './pages/Home';
import Search from './pages/Search';
import ProviderProfile from './pages/ProviderProfile';
import BookService from './pages/BookService';
import BookingDetail from './pages/BookingDetail';
import CustomerDashboard from './pages/CustomerDashboard';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterProvider from './pages/RegisterProvider';

// Provider Portal
import ProviderLayout from './pages/provider/ProviderLayout';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderBookings from './pages/provider/ProviderBookings';
import ProviderServices from './pages/provider/ProviderServices';
import ProviderEarnings from './pages/provider/ProviderEarnings';

// Admin Portal
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminServices from './pages/admin/AdminServices';
import AdminProviders from './pages/admin/AdminProviders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBookings from './pages/admin/AdminBookings';
import AdminReviews from './pages/admin/AdminReviews';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800 selection:bg-primary-600 selection:text-white">
      <Navbar />

      <div className="flex-grow">
        <Routes>
          {/* Public Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/providers/:id" element={<ProviderProfile />} />
          <Route path="/book/:providerId" element={<BookService />} />
          <Route path="/booking/:id" element={<BookingDetail />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/bookings" element={<CustomerDashboard />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-provider" element={<RegisterProvider />} />

          {/* Provider Portal Nested Routes */}
          <Route path="/provider" element={<ProviderLayout />}>
            <Route index element={<ProviderDashboard />} />
            <Route path="dashboard" element={<ProviderDashboard />} />
            <Route path="bookings" element={<ProviderBookings />} />
            <Route path="services" element={<ProviderServices />} />
            <Route path="earnings" element={<ProviderEarnings />} />
          </Route>

          {/* Admin Portal Nested Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="providers" element={<AdminProviders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
