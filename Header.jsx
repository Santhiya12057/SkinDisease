import React from 'react';
import { ShieldAlert, Activity, Sparkles } from 'lucide-react';

export default function Header({ activeTab, onQuickAnalyze }) {
  const pageTitles = {
    dashboard: { title: 'Research Dashboard', sub: 'Overview of the deep learning classification pipeline' },
    analyze: { title: 'Analyze Dermoscopic Image', sub: 'Upload skin lesion image for 7-class inference and explainability' },
    results: { title: 'Classification Result', sub: 'Model predictions, confidence calibration, and class probabilities' },
    explainability: { title: 'Model Explainability (Grad-CAM)', sub: 'Visual gradient-weighted feature attention localization' },
    insights: { title: 'Model Architecture & Training', sub: 'EfficientNet-B0 transfer learning specifications and benchmark comparisons' },
    dataset: { title: 'HAM10000 Dataset Insights', sub: 'Distribution of 10,015 images, lesion-level partitioning, and imbalance strategy' },
    analytics: { title: 'Evaluation Metrics & Confusion Matrix', sub: 'Test partition metrics, precision, recall, and macro F1 analysis' },
    about: { title: 'About DermaVision AI', sub: 'Academic methodology, technical architecture, and ethical limitations' },
  };

  const current = pageTitles[activeTab] || { title: 'DermaVision AI', sub: '' };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
      <div>
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">{current.title}</h2>
        <p className="text-xs text-slate-500 hidden sm:block">{current.sub}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Academic Prototype Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600">
          <Activity className="w-3.5 h-3.5 text-teal-600" />
          <span>HAM10000 / EfficientNet-B0</span>
        </div>

        {/* Quick CTA if not on analyze */}
        {activeTab !== 'analyze' && (
          <button
            onClick={onQuickAnalyze}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyze Image</span>
          </button>
        )}
      </div>
    </header>
  );
}
