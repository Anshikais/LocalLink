import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, ShieldCheck, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function ProviderEarnings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/providers/dashboard/stats')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <div className="p-8 text-xs text-slate-500">Loading financial reports...</div>;

  const { stats } = data;
  const gross = Math.round(stats.totalEarnings * 1.111); // Approximate gross
  const platformCommission = gross - stats.totalEarnings;

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Earnings & Payout Breakdown</h2>
        <p className="text-xs text-slate-500">Transparent financial overview of completed service bookings.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Bookings Value</span>
          <p className="text-2xl font-extrabold text-slate-900">₹{gross}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform Fee (10%)</span>
          <p className="text-2xl font-extrabold text-rose-600">- ₹{platformCommission}</p>
        </div>

        <div className="bg-sky-900 text-white p-6 rounded-3xl shadow-lg space-y-1">
          <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider">Net Provider Income</span>
          <p className="text-3xl font-extrabold text-white">₹{stats.totalEarnings}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">Payout Policy & Monetization Model</h3>
        <ul className="space-y-2 text-xs text-slate-600">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Customer pays total price upon booking completion.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Platform automatically deducts 10% platform service fee.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Remaining 90% net earnings credited directly to provider bank account every Monday.</span>
          </li>
        </ul>
      </div>

    </div>
  );
}
