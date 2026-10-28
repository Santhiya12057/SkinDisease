import React, { useState } from 'react';

export default function ConfusionMatrix({ matrixData, classLabels, displayNames }) {
  const [showNormalized, setShowNormalized] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);

  if (!matrixData || !classLabels) {
    return <div className="p-4 text-xs text-slate-500">Loading confusion matrix...</div>;
  }

  // Calculate row totals for normalization
  const rowTotals = matrixData.map((row) => row.reduce((acc, val) => acc + val, 0));

  // Find max value for color scaling (diagonal usually dominates)
  const maxVal = Math.max(...matrixData.flat());

  const getCellColor = (val, isDiagonal, normalizedVal) => {
    const intensity = showNormalized ? normalizedVal : val / maxVal;
    if (val === 0) return 'bg-slate-50 text-slate-300';
    if (isDiagonal) {
      if (intensity > 0.8) return 'bg-teal-700 text-white font-bold';
      if (intensity > 0.5) return 'bg-teal-600 text-white font-semibold';
      if (intensity > 0.25) return 'bg-teal-500 text-white';
      return 'bg-teal-100 text-teal-900 font-medium';
    } else {
      if (intensity > 0.2) return 'bg-rose-200 text-rose-900 font-semibold';
      if (intensity > 0.08) return 'bg-rose-100 text-rose-900';
      return 'bg-rose-50/70 text-rose-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Interactive 7 × 7 Confusion Matrix</h3>
          <p className="text-xs text-slate-500">
            True vs. predicted classification counts across the 1,494 held-out test lesions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Display:</span>
          <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setShowNormalized(false)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                !showNormalized ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Raw Counts
            </button>
            <button
              onClick={() => setShowNormalized(true)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                showNormalized ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Normalized (%)
            </button>
          </div>
        </div>
      </div>

      {/* The 7x7 Matrix Table */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[540px]">
          {/* Top Label: Predicted Class */}
          <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Predicted Class (Model Output) →
          </div>

          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left font-bold text-slate-400 uppercase text-[10px] w-24">
                  Ground Truth ↓
                </th>
                {classLabels.map((lbl) => (
                  <th
                    key={lbl}
                    className="p-2 text-center font-mono font-bold text-slate-700 text-[11px] uppercase bg-slate-50 border border-slate-200"
                    title={displayNames?.[lbl] || lbl}
                  >
                    {lbl}
                  </th>
                ))}
                <th className="p-2 text-center font-semibold text-slate-400 text-[10px] bg-slate-50 border border-slate-200">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {matrixData.map((row, rIdx) => {
                const rowLabel = classLabels[rIdx];
                const rowTotal = rowTotals[rIdx];

                return (
                  <tr key={rowLabel}>
                    <td
                      className="p-2 font-mono font-bold text-slate-700 text-[11px] uppercase bg-slate-50 border border-slate-200 truncate"
                      title={displayNames?.[rowLabel] || rowLabel}
                    >
                      {rowLabel}
                    </td>

                    {row.map((val, cIdx) => {
                      const colLabel = classLabels[cIdx];
                      const isDiag = rIdx === cIdx;
                      const normVal = rowTotal > 0 ? val / rowTotal : 0;
                      const cellClass = getCellColor(val, isDiag, normVal);

                      return (
                        <td
                          key={colLabel}
                          onMouseEnter={() =>
                            setHoveredCell({
                              trueClass: rowLabel,
                              predClass: colLabel,
                              count: val,
                              pct: (normVal * 100).toFixed(1),
                              isDiag,
                            })
                          }
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`p-2.5 text-center font-mono text-xs border border-slate-200 cursor-pointer transition-colors duration-100 ${cellClass}`}
                        >
                          {showNormalized ? `${(normVal * 100).toFixed(0)}%` : val}
                        </td>
                      );
                    })}

                    <td className="p-2 text-center font-mono font-semibold text-slate-500 bg-slate-50 border border-slate-200">
                      {rowTotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Tooltip & Details Banner */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs min-h-[44px] flex items-center justify-between">
        {hoveredCell ? (
          <div>
            <span className="font-semibold text-slate-700">True Class: </span>
            <strong className="text-slate-900 uppercase font-mono">{hoveredCell.trueClass}</strong>
            {'  '}→{'  '}
            <span className="font-semibold text-slate-700">Predicted: </span>
            <strong className="text-slate-900 uppercase font-mono">{hoveredCell.predClass}</strong>
            {'  '}·{'  '}
            <span className="font-semibold text-slate-700">Count: </span>
            <strong className="font-mono text-teal-800">{hoveredCell.count} samples</strong>
            {' '}({hoveredCell.pct}% of true class)
            {hoveredCell.isDiag ? (
              <span className="ml-2 text-emerald-700 font-semibold">(Correct Prediction)</span>
            ) : (
              <span className="ml-2 text-rose-700 font-semibold">(Misclassification)</span>
            )}
          </div>
        ) : (
          <span className="text-slate-400 italic">
            Hover over any cell in the 7×7 matrix to view exact specimen counts and error rates.
          </span>
        )}

        <div className="flex items-center gap-3 text-[11px] text-slate-500 hidden sm:flex">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-teal-600 inline-block"></span>
            <span>Correct (Diagonal)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-rose-200 inline-block"></span>
            <span>Error (Off-diagonal)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
