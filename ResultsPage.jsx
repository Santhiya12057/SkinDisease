import React from 'react';
import { FileCheck2, ArrowLeft, Eye, ScanEye } from 'lucide-react';
import PredictionCard from '../components/analysis/PredictionCard';
import ProbabilityChart from '../components/analysis/ProbabilityChart';

export default function ResultsPage({ result, onExploreGradcam, onNewAnalysis }) {
  if (!result) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 max-w-xl mx-auto text-center space-y-4 shadow-xs">
        <div className="inline-flex p-3 rounded-full bg-slate-100 text-slate-400">
          <ScanEye className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">No Prediction Available</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Please stage and analyze a dermoscopic image first to generate classification results and probability distributions.
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
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Classification Result</h2>
          <p className="text-xs text-slate-500">
            Dermoscopic visual pattern inference evaluated by EfficientNet-B0 transfer learning.
          </p>
        </div>
        <button
          onClick={onNewAnalysis}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Upload Another Image</span>
        </button>
      </div>

      {/* Main Prediction & Confidence Card */}
      <PredictionCard
        result={result}
        onExploreGradcam={onExploreGradcam}
        onNewAnalysis={onNewAnalysis}
      />

      {/* 7-Class Horizontal Probability Chart */}
      <ProbabilityChart
        probabilities={result.probabilities}
        predictedClass={result.predicted_class}
      />
    </div>
  );
}
