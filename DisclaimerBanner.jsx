import React, { useState } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

export default function DisclaimerBanner() {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center justify-between text-xs text-amber-800">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span className="font-semibold">Research / Educational Prototype Notice:</span>
          <span>Predictions are not medical diagnoses.</span>
        </div>
        <button
          onClick={() => setCollapsed(false)}
          className="text-amber-700 hover:text-amber-900 underline ml-2 font-medium"
        >
          Expand Details
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Medical Disclaimer" className="bg-amber-50/90 border-b border-amber-200/90 px-4 py-2.5 text-xs text-amber-900 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto flex items-start gap-3">
        <div className="p-1 bg-amber-100 rounded-md text-amber-700 flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
              Research / Educational Use Only
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span className="text-[11px] text-amber-700 font-medium">Non-Clinical Demonstration</span>
          </div>
          <p className="text-amber-850 leading-relaxed text-[12px]">
            This application demonstrates an AI-based image classification workflow for educational and research purposes using EfficientNet-B0 and Grad-CAM on the HAM10000 dataset. <strong className="font-semibold text-amber-950">Model predictions are not medical diagnoses and should not be used to make healthcare decisions.</strong> Always consult a qualified dermatologist or healthcare professional for medical evaluation of skin lesions.
          </p>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded transition-colors flex-shrink-0"
          title="Minimize disclaimer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
