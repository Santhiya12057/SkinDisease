import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-teal-50 text-teal-800 border-teal-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function StatCard({ title, value, subtitle, icon: Icon, badge, trend }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs hover:border-slate-300 transition-all duration-150">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-500 tracking-tight">{title}</span>
        {Icon && (
          <div className="p-1.5 rounded-md bg-slate-50 text-teal-700 border border-slate-100">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
        {badge && <Badge variant="primary">{badge}</Badge>}
      </div>
      {subtitle && <p className="mt-1 text-[11px] text-slate-500">{subtitle}</p>}
    </div>
  );
}

export function MetricCard({ label, value, description, highlight = false }) {
  return (
    <div
      className={`rounded-lg p-3.5 border transition-all ${
        highlight
          ? 'bg-teal-50/50 border-teal-200 text-teal-950'
          : 'bg-white border-slate-200/80 text-slate-900'
      }`}
    >
      <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</div>
      <div className="mt-1 text-xl font-bold tracking-tight">{value}</div>
      {description && <div className="mt-0.5 text-[11px] text-slate-500">{description}</div>}
    </div>
  );
}
