import React from 'react';

export default function ConfidenceMeter({ confidence }) {
  // confidence is float 0.0 to 1.0 (or percentage)
  const pct = confidence > 1.0 ? confidence : Math.round(confidence * 1000) / 10;
  
  // Circumference for r=38 circle: 2 * PI * 38 = 238.76
  const r = 38;
  const circ = 2 * Math.PI * r;
  const strokeDashoffset = circ - (circ * (pct / 100));

  // Dynamic clinical color threshold
  let strokeColor = '#0d9488'; // teal default
  let labelColor = 'text-teal-900';
  let badgeText = 'Moderate Confidence';
  
  if (pct >= 85) {
    strokeColor = '#0f766e'; // dark teal
    badgeText = 'High Confidence';
  } else if (pct < 60) {
    strokeColor = '#f59e0b'; // amber
    badgeText = 'Low / Equivocal Confidence';
    labelColor = 'text-amber-900';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
      <div className="relative flex items-center justify-center w-28 h-28">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={r}
            stroke="#e2e8f0"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={r}
            stroke={strokeColor}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circ}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            {pct.toFixed(1)}%
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400">
            Probability
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
          {badgeText}
        </span>
      </div>
    </div>
  );
}
