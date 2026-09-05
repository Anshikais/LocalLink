import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Wrench, Plus, Trash2 } from 'lucide-react';

export default function ProviderServices() {
  const { providerProfile, fetchUserProfile } = useAuth();
  const { showToast } = useNotification();

  const [services, setServices] = useState(providerProfile?.servicesOffered || []);
  const [newServiceName, setNewServiceName] = useState('');
  const [newPrice, setNewPrice] = useState(299);
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    const updated = [...services, { name: newServiceName, price: Number(newPrice), description: newDescription }];
    setLoading(true);
    try {
      await axios.patch('/api/providers/profile', { servicesOffered: updated });
      setServices(updated);
      setNewServiceName('');
      setNewDescription('');
      setNewPrice(299);
      showToast('Service added to your catalog!');
      fetchUserProfile();
    } catch (err) {
      showToast('Failed to add service', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveService = async (index) => {
    const updated = services.filter((_, i) => i !== index);
    try {
      await axios.patch('/api/providers/profile', { servicesOffered: updated });
      setServices(updated);
      showToast('Service removed');
      fetchUserProfile();
    } catch (err) {
      showToast('Failed to remove service', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Services Offered & Rates</h2>
        <p className="text-xs text-slate-500">Configure your menu of services and individual pricing shown to clients.</p>
      </div>

      {/* Add New Service Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Add New Service</h3>
        
        <form onSubmit={handleAddService} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5 space-y-1">
            <label className="text-[11px] font-semibold text-slate-700">Service Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Split AC Gas Refill"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-medium"
            />
          </div>

          <div className="sm:col-span-3 space-y-1">
            <label className="text-[11px] font-semibold text-slate-700">Rate (₹)</label>
            <input
              type="number"
              required
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-medium"
            />
          </div>

          <div className="sm:col-span-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Service
            </button>
          </div>
        </form>
      </div>

      {/* Existing Services List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100">
        <div className="p-4 font-bold text-xs text-slate-800 uppercase tracking-wider">Current Offered Catalog</div>
        {services.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No custom services configured yet.</div>
        ) : (
          services.map((srv, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{srv.name}</h4>
                {srv.description && <p className="text-xs text-slate-500">{srv.description}</p>}
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-slate-900 text-sm">₹{srv.price}</span>
                <button
                  onClick={() => handleRemoveService(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
