import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [providerProfile, setProviderProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('lsf_token') || '');
  const [loading, setLoading] = useState(true);

  // Configure axios default authorization header
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  const fetchUserProfile = async () => {
    if (!token) {
      setUser(null);
      setProviderProfile(null);
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get('/api/auth/profile');
      setUser(res.data.user);
      setProviderProfile(res.data.provider);
    } catch (err) {
      console.error('Session expired or invalid:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token: authToken, user: userData, provider } = res.data;
    localStorage.setItem('lsf_token', authToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    setToken(authToken);
    setUser(userData);
    setProviderProfile(provider);
    return res.data;
  };

  const registerCustomer = async (data) => {
    const res = await axios.post('/api/auth/register', data);
    const { token: authToken, user: userData } = res.data;
    localStorage.setItem('lsf_token', authToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    setToken(authToken);
    setUser(userData);
    return res.data;
  };

  const registerProvider = async (data) => {
    const res = await axios.post('/api/auth/register-provider', data);
    const { token: authToken, user: userData, provider } = res.data;
    localStorage.setItem('lsf_token', authToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    setToken(authToken);
    setUser(userData);
    setProviderProfile(provider);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('lsf_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken('');
    setUser(null);
    setProviderProfile(null);
  };

  const toggleFavorite = async (providerId) => {
    if (!user || user.role !== 'customer') return;
    const isFav = user.favorites?.includes(providerId);
    try {
      if (isFav) {
        await axios.delete(`/api/favorites/${providerId}`);
        setUser(prev => ({
          ...prev,
          favorites: (prev.favorites || []).filter(id => id !== providerId)
        }));
      } else {
        await axios.post(`/api/favorites/${providerId}`);
        setUser(prev => ({
          ...prev,
          favorites: [...(prev.favorites || []), providerId]
        }));
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        providerProfile,
        token,
        loading,
        login,
        registerCustomer,
        registerProvider,
        logout,
        fetchUserProfile,
        toggleFavorite
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
