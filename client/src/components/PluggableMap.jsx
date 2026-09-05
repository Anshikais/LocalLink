import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { Star, MapPin, CheckCircle, ExternalLink } from 'lucide-react';

// Custom Leaflet marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to dynamically re-center map when location changes
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function PluggableMap({
  userLat,
  userLng,
  providers = [],
  radiusKm = 10,
  height = '450px'
}) {
  const defaultCenter = [userLat || 28.6270, userLng || 77.3726];

  return (
    <div style={{ height }} className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <RecenterMap center={defaultCenter} />
        
        {/* OpenStreetMap Tile Layer (Free, zero API key required) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Search Radius Circle */}
        <Circle
          center={defaultCenter}
          radius={radiusKm * 1000}
          pathOptions={{ fillColor: '#0284c7', fillOpacity: 0.08, color: '#0284c7', weight: 1 }}
        />

        {/* User Location Marker */}
        {userLat && userLng && (
          <Marker position={[userLat, userLng]} icon={userIcon}>
            <Popup>
              <div className="text-xs p-1">
                <span className="font-bold text-slate-900 block">Your Current Location</span>
                <span className="text-slate-500">Searching within {radiusKm} km radius</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Provider Markers */}
        {providers.map((p) => {
          if (!p.location || !p.location.coordinates || p.location.coordinates.length < 2) return null;
          const [pLng, pLat] = p.location.coordinates;

          return (
            <Marker key={p._id} position={[pLat, pLng]} icon={customIcon}>
              <Popup>
                <div className="w-52 p-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={p.user?.profileImage || p.coverImage}
                      alt={p.businessName}
                      className="w-10 h-10 rounded-lg object-cover border"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-slate-900 truncate flex items-center gap-1">
                        {p.businessName}
                        {p.verificationStatus === 'approved' && (
                          <CheckCircle className="w-3 h-3 text-emerald-500 inline" />
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate">{p.category?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] border-t border-slate-100 pt-1.5">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {p.rating ? p.rating.toFixed(1) : '5.0'}
                    </span>

                    <span className="font-bold text-sky-700">
                      From ₹{p.startingPrice}
                    </span>
                  </div>

                  {p.distanceKm !== undefined && (
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-600" />
                      {p.distanceKm} km away
                    </p>
                  )}

                  <Link
                    to={`/providers/${p._id}`}
                    className="block text-center text-[11px] font-semibold text-white bg-sky-600 hover:bg-sky-700 py-1.5 rounded-lg transition-colors mt-2"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
