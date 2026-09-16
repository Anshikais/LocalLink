import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { NotificationProvider } from './context/NotificationContext';

// Configure global Axios API Base URL for Production & Development
let rawBaseUrl = import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://server-two-pink-64.vercel.app'
    : '');

// Strip trailing /api or / if present to prevent duplicate /api/api paths
if (rawBaseUrl) {
  rawBaseUrl = rawBaseUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
}

axios.defaults.baseURL = rawBaseUrl;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
