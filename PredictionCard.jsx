import React from 'react';
import { AlertTriangle, ShieldCheck, Cpu, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';
import ConfidenceMeter from './ConfidenceMeter';

export default function PredictionCard({ result, onExploreGradcam, onNewAnalysis }) {
  if (!result) return null;

  const {
    predicted_class,
    predicted_label,
    description,
    confidence,
    model,
    input_size,
    latency_ms
  } = result;

  const confPct = confidence > 1.0 ? confidence : (confidence * 100);

  // Risk badges
  const isMalignant = predicted_class === 'mel' || predicted_class === 'bcc';
  const isPreCancer = predicted_class === 'akiec';

  return (
    <div className="space-y-4">
      {/* Primary Result Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Model Prediction Output
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
            {model || 'EfficientNet-B0'} · {input_size || '224x224'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Main Class & Interpretation */}
          <div className="md:col-span-8 space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Predicted Class Category
              </span>
              <div className="flex items-center gap-2.5 mt-0.5">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {predicted_label || predicted_class}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold uppercase">
                  {predicted_class}
                </span>
              </div>
            </div>

            {/* Description & Clinical Pathology Notes */}
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {description}
            </p>

            {/* Meta Tags */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                  isMalignant
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : isPreCancer
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {isMalignant ? 'Malignant Neoplasm Class' : isPreCancer ? 'Pre-Malignant Variant' : 'Benign Lesion Class'}
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-200">
                Inference Latency: <strong className="font-mono">{latency_ms || 24} ms</strong>
              </span>
            </div>
          </div>

          {/* Confidence Meter Side */}
          <div className="md:col-span-4 flex flex-col items-center justify-center">
            <span className="text-[11px] uppercase font-semibold text-slate-400 mb-1">
              Classification Confidence
            </span>
            <ConfidenceMeter confidence={confPct} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <button
            onClick={onExploreGradcam}
            className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Examine Grad-CAM Attention Heatmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onNewAnalysis}
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors"
          >
            Analyze Another Image
          </button>
        </div>
      </div>

      {/* Mandatory Research Interpretation Card */}
      <div className="bg-slate-50 rounded-xl border border-slate-200/90 p-4 flex items-start gap-3 text-xs text-slate-700">
        <div className="p-1 rounded bg-slate-200 text-slate-700 flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900">Research Interpretation Rationale</h4>
          <p className="leading-relaxed text-slate-600">
            The model assigned the highest probability to this class based on visual patterns and textural features learned from the HAM10000 training distribution. <strong className="font-semibold text-slate-900">This output is intended strictly for educational and research purposes and should not be interpreted as a medical diagnosis.</strong> Clinical verification requires histological biopsy and specialist evaluation.
          </p>
        </div>
      </div>
    </div>
  );
}
