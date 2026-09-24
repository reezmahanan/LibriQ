import React from 'react';

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'primary' }) {
  const colorMap = {
    primary: {
      bg: 'bg-[#eaf0f6]',
      text: 'text-[#1E3A5F]',
      border: 'border-[#d4e0ee]',
    },
    secondary: {
      bg: 'bg-[#edf5f9]',
      text: 'text-[#2E6F95]',
      border: 'border-[#d6e8f2]',
    },
    accent: {
      bg: 'bg-[#fef5df]',
      text: 'text-[#df9f24]',
      border: 'border-[#fde9b8]',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
    },
  };

  const scheme = colorMap[color] || colorMap.primary;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between transition hover:shadow-md hover:border-[#2E6F95]/30">
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-[#1F2937] tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl ${scheme.bg} ${scheme.border} border flex items-center justify-center ${scheme.text} shadow-xs`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
