import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';

export default function DatasetChart({ classesData }) {
  if (!classesData) {
    return <div className="p-4 text-xs text-slate-500">Loading dataset distribution...</div>;
  }

  const chartData = Object.entries(classesData).map(([key, item]) => ({
    key,
    name: item.name,
    count: item.count,
    percentage: item.percentage,
    fill: key === 'nv' ? '#0d9488' : '#334155',
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">HAM10000 Class Frequency Distribution</h3>
          <p className="text-xs text-slate-500">
            Absolute sample frequencies across 10,015 curated dermoscopic images.
          </p>
        </div>
        <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
          Total: 10,015 Images
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="key"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace', fontWeight: 600 }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickFormatter={(v) => v.toLocaleString()}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-md space-y-0.5">
                      <div className="font-bold text-teal-300 font-mono uppercase">{d.key}</div>
                      <div className="text-slate-200">{d.name}</div>
                      <div className="text-slate-400 font-mono text-[11px] pt-1">
                        Count: <strong className="text-white">{d.count.toLocaleString()}</strong> ({d.percentage}%)
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.key === 'nv' ? '#0d9488' : '#0284c7'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2 border-t border-slate-100 text-xs">
        {chartData.map((item) => (
          <div key={item.key} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="font-mono text-[10px] font-bold text-slate-500 uppercase block">
              {item.key}
            </span>
            <span className="font-mono text-xs font-bold text-slate-900 block mt-0.5">
              {item.count.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
