import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SkeletonLoader from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import { 
  Wrench, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle, 
  X 
} from 'lucide-react';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [startingPrice, setStartingPrice] = useState(299);
  const [estimatedDuration, setEstimatedDuration] = useState('1-2 hours');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=400');
  const [isActive, setIsActive] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [srvRes, catRes] = await Promise.all([
        axios.get('/api/services?all=true'),
        axios.get('/api/categories')
      ]);
      setServices(srvRes.data);
      setCategories(catRes.data);
      if (catRes.data.length > 0 && !categoryId) {
        setCategoryId(catRes.data[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setName('');
    setDescription('');
    if (categories.length > 0) setCategoryId(categories[0]._id);
    setStartingPrice(299);
    setEstimatedDuration('1-2 hours');
    setImage('https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=400');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (srv) => {
    setEditingService(srv);
    setName(srv.name);
    setDescription(srv.description);
    setCategoryId(srv.category?._id || srv.category);
    setStartingPrice(srv.startingPrice);
    setEstimatedDuration(srv.estimatedDuration || '1-2 hours');
    setImage(srv.image || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=400');
    setIsActive(srv.isActive !== false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await axios.patch(`/api/services/${editingService._id}`, {
          name,
          description,
          category: categoryId,
          startingPrice,
          estimatedDuration,
          image,
          isActive
        });
      } else {
        await axios.post('/api/services', {
          name,
          description,
          category: categoryId,
          startingPrice,
          estimatedDuration,
          image,
          isActive
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving service');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`/api/services/${id}/status`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error toggling service status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await axios.delete(`/api/services/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting service');
    }
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = !selectedCategoryFilter || (s.category?._id === selectedCategoryFilter || s.category === selectedCategoryFilter);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Services Catalog</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage offered service items under categories with transparent pricing.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search services catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200/90 pl-10 pr-4 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="w-full sm:w-60 bg-white border border-slate-200/90 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Services Table */}
      {loading ? (
        <SkeletonLoader count={4} />
      ) : filteredServices.length === 0 ? (
        <EmptyState title="No services found" message="Add a service to populate your catalog." />
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                  <th className="p-4">Service Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Starting Price</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredServices.map((srv) => (
                  <tr key={srv._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={srv.image} alt={srv.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                        <div>
                          <h4 className="font-extrabold text-slate-900">{srv.name}</h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">{srv.description}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-700">
                      {srv.category?.name || 'Unassigned'}
                    </td>

                    <td className="p-4 font-extrabold text-slate-900">
                      ₹{srv.startingPrice}
                    </td>

                    <td className="p-4 text-slate-500 font-semibold">
                      {srv.estimatedDuration || '1-2 hours'}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(srv._id)}
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border transition-colors ${
                          srv.isActive !== false
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : 'text-slate-500 bg-slate-100 border-slate-200'
                        }`}
                      >
                        {srv.isActive !== false ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(srv)}
                          className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Service"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(srv._id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-6 animate-in fade-in max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-800 uppercase tracking-wider block">Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AC Deep Foam Jet Servicing"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 uppercase tracking-wider block">Parent Category *</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold text-slate-800"
                >
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 uppercase tracking-wider block">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed description of what is included in this service..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 uppercase tracking-wider block">Starting Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 uppercase tracking-wider block">Estimated Duration</label>
                  <input
                    type="text"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    placeholder="e.g. 1-2 hours"
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Service Image URL Input */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 uppercase tracking-wider block">Service Image URL *</label>
                <div className="flex items-center gap-3">
                  <img src={image} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Service Active</span>
                </label>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
