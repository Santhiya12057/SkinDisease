import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const CLASS_METADATA = {
  akiec: { name: 'Actinic Keratoses', risk: 'Pre-Malignant', baseColor: '#f59e0b' },
  bcc: { name: 'Basal Cell Carcinoma', risk: 'Malignant', baseColor: '#e11d48' },
  bkl: { name: 'Benign Keratolytic', risk: 'Benign', baseColor: '#059669' },
  df: { name: 'Dermatofibroma', risk: 'Benign', baseColor: '#0d9488' },
  mel: { name: 'Melanoma', risk: 'Malignant High-Risk', baseColor: '#be123c' },
  nv: { name: 'Melanocytic Nevi', risk: 'Benign Common Mole', baseColor: '#10b981' },
  vasc: { name: 'Vascular Lesions', risk: 'Benign Vascular', baseColor: '#6366f1' },
};

export default function ProbabilityChart({ probabilities, predictedClass }) {
  if (!probabilities) return null;

  // Transform object to array sorted by probability descending
  const data = Object.entries(probabilities)
    .map(([key, prob]) => {
      const meta = CLASS_METADATA[key] || { name: key, risk: 'Unknown', baseColor: '#0d9488' };
      const pct = typeof prob === 'number' ? (prob > 1.0 ? prob : prob * 100) : 0;
      return {
        key,
        name: meta.name,
        percentage: Number(pct.toFixed(2)),
        isPredicted: key === predictedClass,
        risk: meta.risk,
        fillColor: key === predictedClass ? '#0d9488' : '#94a3b8',
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900 tracking-tight uppercase">
            7-Class Probability Distribution
          </h4>
          <p className="text-[11px] text-slate-500">
            Softmax output vector normalized across HAM10000 disease categories.
          </p>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
          Sum: 100.0%
        </span>
      </div>

      {/* Horizontal List with Visual Bars */}
      <div className="space-y-2.5">
        {data.map((item) => (
          <div
            key={item.key}
            className={`p-2 rounded-lg transition-colors ${
              item.isPredicted
                ? 'bg-teal-50/70 border border-teal-200'
                : 'bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                  {item.key}
                </span>
                <span className={`font-semibold ${item.isPredicted ? 'text-teal-950 font-bold' : 'text-slate-800'}`}>
                  {item.name}
                </span>
                {item.isPredicted && (
                  <span className="text-[9px] bg-teal-700 text-white px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider">
                    Highest
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 hidden sm:inline">{item.risk}</span>
                <span className="font-mono text-xs font-bold text-slate-900">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Bar progress track */}
            <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  item.isPredicted ? 'bg-teal-700' : 'bg-slate-400'
                }`}
                style={{ width: `${Math.max(item.percentage, 0.5)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
