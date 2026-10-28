import React from 'react';

export default function PerClassTable({ perClassData, macroAvg, weightedAvg, displayNames }) {
  if (!perClassData) {
    return <div className="p-4 text-xs text-slate-500">Loading per-class metrics...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Per-Class Statistical Metrics</h3>
          <p className="text-xs text-slate-500">
            Harmonic F1, precision, and sensitivity calculated on the un-augmented test split.
          </p>
        </div>
        <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
          Evaluated Model: EfficientNet-B0
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 font-semibold">Lesion Class</th>
              <th className="py-3 px-3 font-semibold text-center">Precision</th>
              <th className="py-3 px-3 font-semibold text-center">Recall (Sensitivity)</th>
              <th className="py-3 px-3 font-semibold text-center">F1 Score</th>
              <th className="py-3 px-4 font-semibold text-center">Support (N)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Object.entries(perClassData).map(([key, item]) => (
              <tr key={key} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500 uppercase">{key}</span>
                    <span>{displayNames?.[key] || key}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-700">
                  {(item.precision * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-700">
                  {(item.recall * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                  {(item.f1_score * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-4 text-center font-mono text-slate-600">
                  {item.support}
                </td>
              </tr>
            ))}

            {/* Macro Average Row */}
            {macroAvg && (
              <tr className="bg-slate-50/90 font-semibold border-t-2 border-slate-200">
                <td className="py-3 px-4 text-slate-900">
                  Macro Average (Unweighted)
                </td>
                <td className="py-3 px-3 text-center font-mono text-teal-800">
                  {(macroAvg.precision * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-3 text-center font-mono text-teal-800">
                  {(macroAvg.recall * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-3 text-center font-mono font-bold text-teal-900">
                  {(macroAvg.f1_score * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-4 text-center font-mono text-slate-600">
                  {macroAvg.support}
                </td>
              </tr>
            )}

            {/* Weighted Average Row */}
            {weightedAvg && (
              <tr className="bg-slate-100/60 font-medium">
                <td className="py-3 px-4 text-slate-700">
                  Weighted Average (Support Weighted)
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-700">
                  {(weightedAvg.precision * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-700">
                  {(weightedAvg.recall * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-900">
                  {(weightedAvg.f1_score * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-4 text-center font-mono text-slate-600">
                  {weightedAvg.support}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
        <strong className="text-slate-700 font-semibold">Macro-averaged metrics</strong> give equal importance to each class regardless of sample size, which is essential for evaluating imbalanced multi-class classification where minority classes like <code className="text-slate-700 font-mono">df</code> (16 samples) and <code className="text-slate-700 font-mono">vasc</code> (21 samples) must be properly scrutinized.
      </div>
    </div>
  );
}
