import React from 'react';
import {
  LayoutDashboard,
  ScanEye,
  FileCheck2,
  Eye,
  Cpu,
  Database,
  BarChart3,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, hasResult, backendOnline }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Image', icon: ScanEye },
    { id: 'results', label: 'Results', icon: FileCheck2, badge: hasResult ? 'Ready' : null },
    { id: 'explainability', label: 'Explainability', icon: Eye, badge: hasResult ? 'Grad-CAM' : null },
    { id: 'insights', label: 'Model Insights', icon: Cpu },
    { id: 'dataset', label: 'Dataset', icon: Database },
    { id: 'analytics', label: 'Results Analytics', icon: BarChart3 },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center text-white shadow-sm shadow-teal-700/20">
          <ScanEye className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-slate-900 tracking-tight text-base leading-tight">DermaVision AI</h1>
          </div>
          <p className="text-[11px] font-medium text-slate-500 tracking-tight">Explainable DL Prototype</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Platform Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-teal-50 text-teal-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-teal-700' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-teal-200 text-teal-850'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Status Card */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {backendOnline ? (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              ) : (
                <span className="inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              )}
              <span className="text-[11px] font-semibold text-slate-800">
                {backendOnline ? 'Model Active' : 'Connecting...'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              v1.0.0
            </span>
          </div>

          <div className="text-[11px] text-slate-600 space-y-0.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Architecture</span>
              <span className="font-medium text-slate-700">EfficientNet-B0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Explainability</span>
              <span className="font-medium text-slate-700">Grad-CAM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Environment</span>
              <span className="font-medium text-slate-700">Research Prototype</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
