import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Shield, PhoneCall, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white text-slate-600 text-xs border-t border-slate-200/90 pb-20 md:pb-8 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-200/80">
          
          {/* Column 1: LocalService Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 font-extrabold text-lg text-slate-900">
              <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-xs">
                <Wrench className="w-4 h-4" />
              </div>
              <span>Local<span className="text-primary-600">Service</span></span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Connecting homeowners with background-verified local service professionals, plumbers, electricians, and technicians across India.
            </p>

            <div className="flex items-center gap-1.5 text-xs text-primary-800 bg-primary-100 px-3 py-1 rounded-lg border border-primary-200 font-semibold w-fit">
              <Shield className="w-4 h-4 text-primary-600 shrink-0" />
              <span>Verified Local Professionals</span>
            </div>
          </div>

          {/* Column 2: Popular Services */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm mb-3">Popular Services</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/search?category=plumbing" className="hover:text-primary-600 transition-colors">
                  Plumbing Repairs
                </Link>
              </li>
              <li>
                <Link to="/search?category=electrical-services" className="hover:text-primary-600 transition-colors">
                  Electrical & Wiring
                </Link>
              </li>
              <li>
                <Link to="/search?category=ac-repair" className="hover:text-primary-600 transition-colors">
                  AC Repair & Servicing
                </Link>
              </li>
              <li>
                <Link to="/search?category=home-cleaning" className="hover:text-primary-600 transition-colors">
                  Home Deep Cleaning
                </Link>
              </li>
              <li>
                <Link to="/search?category=beauty-salon" className="hover:text-primary-600 transition-colors">
                  Salon & Beauty at Home
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/search" className="hover:text-primary-600 transition-colors">
                  Browse Providers
                </Link>
              </li>
              <li>
                <Link to="/register-provider" className="text-primary-700 font-bold hover:underline">
                  Join as a Provider
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-primary-600 transition-colors">
                  Track My Booking
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-600 transition-colors">
                  Account Login
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-primary-600 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Support */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm mb-3">Customer Support</h4>
            <ul className="space-y-2.5 font-medium">
              <li className="flex items-center gap-2 text-slate-700">
                <PhoneCall className="w-4 h-4 text-primary-600 shrink-0" />
                <span>+91 1800 123 4567 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-primary-600 shrink-0" />
                <span>support@localservicefinder.com</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
                <span>Lucknow • Noida NCR • Delhi • Gurgaon</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-medium gap-3">
          <p>© {new Date().getFullYear()} LocalService. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-600 cursor-pointer">Safety Guidelines</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
