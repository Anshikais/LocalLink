import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SkeletonLoader from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  UserX, 
  UserCheck, 
  Trash2, 
  Edit 
} from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/users?role=${roleFilter}&search=${searchQuery}`);
      setUsers(res.data.users || res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleSuspend = async (id) => {
    try {
      await axios.patch(`/api/admin/users/${id}/suspend`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error toggling user status');
    }
  };

  const handleChangeRole = async (userObj) => {
    const newRole = prompt(`Change role for ${userObj.name} (current: ${userObj.role}). Enter: customer, provider, or admin:`, userObj.role);
    if (!newRole || newRole === userObj.role) return;
    if (!['customer', 'provider', 'admin'].includes(newRole)) {
      alert('Invalid role specified.');
      return;
    }
    try {
      await axios.patch(`/api/admin/users/${userObj._id}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating role');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage customer, provider, and administrator user accounts across the platform.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200/90 pl-10 pr-4 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-48 bg-white border border-slate-200/90 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700"
        >
          <option value="">All Roles</option>
          <option value="customer">Customers</option>
          <option value="provider">Providers</option>
          <option value="admin">Administrators</option>
        </select>
      </form>

      {/* User Directory Table */}
      {loading ? (
        <SkeletonLoader count={4} />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" message="Try searching for a different name or email." />
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                  <th className="p-4">User</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <h4 className="font-extrabold text-slate-900">{u.name}</h4>
                          <p className="text-[11px] text-slate-500 font-medium">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-700">
                      {u.phone || 'N/A'}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleChangeRole(u)}
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border transition-colors ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 border-purple-200'
                            : u.role === 'provider'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                        title="Click to change role"
                      >
                        {u.role}
                      </button>
                    </td>

                    <td className="p-4">
                      {u.isSuspended ? (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                          Suspended
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-slate-500 font-medium">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleSuspend(u._id)}
                          className={`px-3 py-1 font-bold text-[11px] rounded-lg transition-colors ${
                            u.isSuspended
                              ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                              : 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                          }`}
                        >
                          {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete User"
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

    </div>
  );
}
