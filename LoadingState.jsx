import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

export default function LoadingState() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 0, text: 'Image uploaded & verified' },
    { id: 1, text: 'Preprocessing (224×224 bilinear resize, ImageNet normalization)' },
    { id: 2, text: 'Running EfficientNet-B0 forward inference' },
    { id: 3, text: 'Generating Grad-CAM attention heatmap from features[-1]' },
    { id: 4, text: 'Preparing clinical-grade confidence and probability distribution' },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(2), 500);
    const timer2 = setTimeout(() => setCurrentStep(3), 1100);
    const timer3 = setTimeout(() => setCurrentStep(4), 1700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-xl mx-auto shadow-sm text-center">
      <div className="inline-flex p-3 rounded-full bg-teal-50 text-teal-700 mb-4 ring-8 ring-teal-50/50">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>

      <h3 className="text-base font-bold text-slate-900 tracking-tight">Analyzing Dermoscopic Image</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
        Running EfficientNet-B0 convolutional feature extraction and gradient-weighted explainability mapping.
      </p>

      {/* Steps List */}
      <div className="mt-6 text-left max-w-md mx-auto space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div key={step.id} className="flex items-center gap-3 text-xs">
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-teal-600 animate-spin flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
              )}
              <span
                className={`transition-colors ${
                  isDone
                    ? 'text-slate-700 font-medium'
                    : isCurrent
                    ? 'text-teal-900 font-semibold'
                    : 'text-slate-400'
                }`}
              >
                {step.text}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 text-[11px] text-slate-400 italic">
        Please wait while the PyTorch inference engine calculates class activations...
      </div>
    </div>
  );
}
