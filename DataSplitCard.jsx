import React from 'react';
import { GitFork, ShieldCheck, Scale, AlertCircle } from 'lucide-react';

export default function DataSplitCard({ splits, splitRationale, imbalanceStrategy }) {
  const defaultSplits = splits || {
    train: { images: 7002, percentage: 69.91 },
    validation: { images: 1519, percentage: 15.17 },
    test: { images: 1494, percentage: 14.92 },
  };

  return (
    <div className="space-y-4">
      {/* 3 Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Training Partition
            </span>
            <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {defaultSplits.train.percentage}%
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {defaultSplits.train.images.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-500 font-sans">images</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Optimized with class-weighted cross-entropy loss and random spatial/color jitter augmentations.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Validation Partition
            </span>
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {defaultSplits.validation.percentage}%
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {defaultSplits.validation.images.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-500 font-sans">images</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Used for hyperparameter tuning, learning rate scheduling, and checkpoint early stopping.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Testing Partition
            </span>
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {defaultSplits.test.percentage}%
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {defaultSplits.test.images.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-500 font-sans">images</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Held-out benchmark test set for unbiased confusion matrix and per-class F1 evaluation.
          </p>
        </div>
      </div>

      {/* Rationale & Imbalance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-start gap-3 text-xs text-slate-700">
          <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700 flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900">Lesion-Level Split (Leakage Prevention)</h4>
            <p className="text-slate-600 leading-relaxed">
              {splitRationale ||
                'Splits are performed strictly at the lesion level (grouping by lesion_id) to prevent images from the same lesion appearing across different partitions. Many patients have multiple dermatoscopic captures of the same nevus, which would cause severe optimistic data leakage if split randomly.'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-start gap-3 text-xs text-slate-700">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 flex-shrink-0 mt-0.5">
            <Scale className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900">Severe Class Imbalance Strategy</h4>
            <p className="text-slate-600 leading-relaxed">
              {imbalanceStrategy ||
                'The dataset contains substantially more examples from some classes than others (e.g. nv comprises 66.9% vs df at 1.15%). Class-weighted training is therefore used to reduce the influence of class imbalance during optimization, penalizing misclassifications on minority categories proportionally.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
