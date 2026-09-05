import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SkeletonLoader from '../../components/SkeletonLoader';
import { 
  Settings, 
  IndianRupee, 
  Mail, 
  Globe, 
  CheckCircle, 
  ShieldCheck 
} from 'lucide-react';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [commissionPercentage, setCommissionPercentage] = useState(10);
  const [platformName, setPlatformName] = useState('Local Service Finder');
  const [contactEmail, setContactEmail] = useState('support@localservicefinder.com');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    axios.get('/api/admin/statistics')
      .then(res => {
        const s = res.data.stats;
        if (s.commissionPercentage !== undefined) setCommissionPercentage(s.commissionPercentage);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await axios.patch('/api/admin/settings', {
        commissionPercentage: Number(commissionPercentage),
        platformName,
        contactEmail
      });
      setSuccessMsg('Platform settings updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SkeletonLoader count={2} />;
  }

  return (
    <div className="max-w-2xl space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Configure platform commission fees, support contacts, and system rules.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 text-xs">
        
        {/* Commission Rate */}
        <div className="space-y-1">
          <label className="font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-emerald-600" /> Platform Commission Fee (%)
          </label>
          <input
            type="number"
            min="0"
            max="50"
            required
            value={commissionPercentage}
            onChange={(e) => setCommissionPercentage(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-extrabold text-slate-900 text-sm"
          />
          <p className="text-[11px] text-slate-400 font-medium">
            Commission percentage automatically deducted from provider earnings on booking completion.
          </p>
        </div>

        {/* Platform Name */}
        <div className="space-y-1">
          <label className="font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-emerald-600" /> Platform Title
          </label>
          <input
            type="text"
            required
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold text-slate-900"
          />
        </div>

        {/* Support Email */}
        <div className="space-y-1">
          <label className="font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-emerald-600" /> Official Support Email
          </label>
          <input
            type="email"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold text-slate-900"
          />
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>

    </div>
  );
}
