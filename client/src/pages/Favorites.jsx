import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProviderCard from '../components/ProviderCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { Heart } from 'lucide-react';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/favorites')
      .then(res => setFavorites(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <Heart className="w-5 h-5 fill-rose-500" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Saved Providers</h1>
          <p className="text-xs text-slate-500">Quickly re-book your preferred local service professionals.</p>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader count={3} />
      ) : favorites.length === 0 ? (
        <EmptyState
          title="No favorite providers saved."
          message="Click the heart icon on any provider card to bookmark them for easy access."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(provider => (
            <ProviderCard key={provider._id} provider={provider} />
          ))}
        </div>
      )}

    </div>
  );
}
