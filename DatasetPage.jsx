import React from 'react';
import { Database, Image as ImageIcon, Scale, GitFork, Info } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import DatasetChart from '../components/dataset/DatasetChart';
import DataSplitCard from '../components/dataset/DataSplitCard';

export default function DatasetPage({ datasetInfo }) {
  const classes = datasetInfo?.classes || {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 4 Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          title="Total Images"
          value={datasetInfo?.total_images?.toLocaleString() || '10,015'}
          subtitle="RGB Dermoscopy"
          icon={Database}
        />
        <StatCard
          title="Diagnostic Classes"
          value={datasetInfo?.num_classes || '7'}
          subtitle="Pathological categories"
          icon={Scale}
        />
        <StatCard
          title="Native Resolution"
          value={datasetInfo?.image_dimensions || '600 × 450'}
          subtitle="High-definition dermoscopy"
          icon={ImageIcon}
        />
        <StatCard
          title="Partitioning"
          value="Lesion-Level"
          subtitle="Zero patient leakage"
          icon={GitFork}
        />
      </div>

      {/* Class Frequency Distribution Chart */}
      <DatasetChart classesData={classes} />

      {/* Train / Validation / Test Splits */}
      <DataSplitCard
        splits={datasetInfo?.splits}
        splitRationale={datasetInfo?.split_rationale}
        imbalanceStrategy={datasetInfo?.imbalance_strategy}
      />

      {/* 7 Clinical Lesion Classes Rationale Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">The 7 Diagnostic Lesion Categories</h3>
          <p className="text-xs text-slate-500">
            Pathological profiles, diagnostic significance, and sample counts in the HAM10000 repository.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(classes).map(([key, item]) => (
            <div key={key} className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-slate-600 uppercase bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {key}
                    </span>
                    <strong className="text-slate-900 font-bold">{item.name}</strong>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-600">
                    {item.count?.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                <strong className="text-slate-700">Clinical profile:</strong> {item.clinical_significance}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
