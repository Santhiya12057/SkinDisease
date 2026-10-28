import React from 'react';
import { Eye, ArrowLeft, ScanEye } from 'lucide-react';
import ExplainabilityViewer from '../components/explainability/ExplainabilityViewer';

export default function ExplainabilityPage({ explainData, result, onNewAnalysis }) {
  if (!explainData) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 max-w-xl mx-auto text-center space-y-4 shadow-xs">
        <div className="inline-flex p-3 rounded-full bg-slate-100 text-slate-400">
          <Eye className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">No Explainability Map Available</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Please analyze an image first to extract convolutional feature activations and backward gradient maps.
          </p>
        </div>
        <button
          onClick={onNewAnalysis}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors"
        >
          <span>Go to Analyze Image</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Breadcrumb / Title Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Model Explainability</h2>
          <p className="text-xs text-slate-500">
            Grad-CAM provides a visual indication of image regions that contributed to the model's prediction.
          </p>
        </div>
        <button
          onClick={onNewAnalysis}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Analyze Another</span>
        </button>
      </div>

      <ExplainabilityViewer
        explainData={explainData}
        predictedClass={result?.predicted_class}
        predictedLabel={result?.predicted_label}
      />
    </div>
  );
}
