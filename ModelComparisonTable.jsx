import React from 'react';
import { CheckCircle2, Award, Zap } from 'lucide-react';

export default function ModelComparisonTable({ models }) {
  if (!models || models.length === 0) {
    return <div className="p-4 text-xs text-slate-500">Loading model benchmarks...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Model Architecture Comparison</h3>
          <p className="text-xs text-slate-500">
            Empirical evaluation across baseline CNN vs. transfer learning iterations on the HAM10000 held-out test split.
          </p>
        </div>
        <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
          N = 1,494 Test Images
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 font-semibold">Model Architecture</th>
              <th className="py-3 px-3 font-semibold text-center">Parameters</th>
              <th className="py-3 px-3 font-semibold text-center">Accuracy</th>
              <th className="py-3 px-3 font-semibold text-center">Macro Precision</th>
              <th className="py-3 px-3 font-semibold text-center">Macro Recall</th>
              <th className="py-3 px-3 font-semibold text-center">Macro F1</th>
              <th className="py-3 px-3 font-semibold text-center">Latency</th>
              <th className="py-3 px-4 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {models.map((m, idx) => {
              const isSelected = m.selected;
              return (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    isSelected ? 'bg-teal-50/40 font-medium' : 'hover:bg-slate-50/60'
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      {m.model_name}
                      {isSelected && (
                        <span className="text-[9px] font-semibold bg-teal-700 text-white px-1.5 py-0.2 rounded uppercase">
                          Selected Final
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 max-w-sm">{m.description}</div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-600">{m.parameters}</td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-900">
                    {(m.accuracy * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-700">
                    {(m.macro_precision * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-700">
                    {(m.macro_recall * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-900">
                    {(m.macro_f1 * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-600">
                    {m.inference_latency_ms} ms
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Active Pipeline
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Baseline</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
