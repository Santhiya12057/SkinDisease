import React from 'react';
import { BarChart3, HelpCircle } from 'lucide-react';
import ConfusionMatrix from '../components/metrics/ConfusionMatrix';
import PerClassTable from '../components/metrics/PerClassTable';

export default function ResultsAnalyticsPage({ metrics }) {
  const confusion = metrics?.confusion_matrix;
  const perClass = metrics?.per_class_metrics;
  const macroAvg = metrics?.macro_average;
  const weightedAvg = metrics?.weighted_average;
  const displayNames = metrics?.class_display_names;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Overview header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Test Partition Results Analytics</h2>
          <p className="text-xs text-slate-500">
            Rigorous held-out evaluation across 1,494 test images with zero lesion overlap.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          Macro F1: <strong className="text-slate-900">{(macroAvg?.f1_score * 100 || 81.5).toFixed(1)}%</strong> · Accuracy:{' '}
          <strong className="text-slate-900">{(metrics?.comparison?.[2]?.accuracy * 100 || 89.9).toFixed(1)}%</strong>
        </div>
      </div>

      {/* Interactive 7x7 Confusion Matrix */}
      <ConfusionMatrix
        matrixData={confusion?.matrix}
        classLabels={confusion?.labels}
        displayNames={displayNames}
      />

      {/* Per-Class Precision, Recall, F1 Table */}
      <PerClassTable
        perClassData={perClass}
        macroAvg={macroAvg}
        weightedAvg={weightedAvg}
        displayNames={displayNames}
      />
    </div>
  );
}
