import React from 'react';
import { SearchX } from 'lucide-react';

export default function EmptyState({
  title = "No providers found.",
  message = "Try increasing your search radius or selecting another service category.",
  actionText,
  onAction
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-4 max-w-md mx-auto my-8">
      <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
        <SearchX className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{message}</p>
      </div>
      {actionText && (
        <button
          onClick={onAction}
          className="text-xs font-semibold px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition-all shadow-md"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
