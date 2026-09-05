import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SkeletonLoader from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import { 
  FolderTree, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle, 
  X, 
  Wrench, 
  Zap, 
  Wind, 
  Tv, 
  Scissors, 
  BookOpen, 
  Car, 
  Paintbrush, 
  Hammer 
} from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Wrench');
  const [type, setType] = useState('Home Services');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600');
  const [isActive, setIsActive] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIcon('Wrench');
    setType('Home Services');
    setImage('https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setIcon(cat.icon || 'Wrench');
    setType(cat.type || 'Home Services');
    setImage(cat.image);
    setIsActive(cat.isActive !== false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.patch(`/api/categories/${editingCategory._id}`, {
          name,
          description,
          icon,
          image,
          type,
          isActive
        });
      } else {
        await axios.post('/api/categories', {
          name,
          description,
          icon,
          image,
          type,
          isActive
        });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting category');
    }
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Category Management</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Add, edit, or remove service categories. Changes instantly sync with the user app.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200/90 pl-10 pr-4 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Category Table */}
      {loading ? (
        <SkeletonLoader count={4} />
      ) : filteredCategories.length === 0 ? (
        <EmptyState title="No categories found" message="Add a category to populate your marketplace catalog." />
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                  <th className="p-4">Category</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Providers</th>
                  <th className="p-4">Services</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCategories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                        <div>
                          <h4 className="font-extrabold text-slate-900">{cat.name}</h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">{cat.description}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-md text-[11px]">
                        {cat.type || 'Home Services'}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-slate-900">
                      {cat.providerCount || 0} pros
                    </td>

                    <td className="p-4 font-bold text-slate-900">
                      {cat.serviceCount || 0} services
                    </td>

                    <td className="p-4">
                      {cat.isActive !== false ? (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Category"
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

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-6 animate-in fade-in max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-800 uppercase tracking-wider block">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar Panel Repair"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 uppercase tracking-wider block">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Description of services offered under this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 uppercase tracking-wider block">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold text-slate-800"
                  >
                    <option value="Home Services">Home Services</option>
                    <option value="Personal Services">Personal Services</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Professional">Professional</option>
                    <option value="Technology">Technology</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 uppercase tracking-wider block">Lucide Icon</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold text-slate-800"
                  >
                    <option value="Wrench">Wrench</option>
                    <option value="Zap">Zap</option>
                    <option value="Wind">Wind</option>
                    <option value="Sparkles">Sparkles</option>
                    <option value="Tv">Tv</option>
                    <option value="Scissors">Scissors</option>
                    <option value="BookOpen">BookOpen</option>
                    <option value="Car">Car</option>
                    <option value="Paintbrush">Paintbrush</option>
                    <option value="Hammer">Hammer</option>
                  </select>
                </div>
              </div>

              {/* Image URL Input */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 uppercase tracking-wider block">Category Image URL *</label>
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
                  <span>Category Active</span>
                </label>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
