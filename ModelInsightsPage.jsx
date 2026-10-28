import React from 'react';
import { Cpu, Layers, GitBranch, ShieldCheck, CheckCircle2 } from 'lucide-react';
import ModelComparisonTable from '../components/metrics/ModelComparisonTable';

export default function ModelInsightsPage({ modelInfo, metrics }) {
  const trainingStrategies = [
    { name: 'Bilinear Resizing', detail: 'Input dermoscopy photographs standardized to 224 × 224 × 3 pixels.' },
    { name: 'ImageNet Normalization', detail: 'Channel mean [0.485, 0.456, 0.406] and std [0.229, 0.224, 0.225].' },
    { name: 'Spatial Augmentations', detail: 'Random horizontal & vertical flips (p=0.5), random affine rotations (-30° to +30°).' },
    { name: 'Color Jittering', detail: 'Random brightness (0.15), contrast (0.15), and saturation (0.15) adjustments.' },
    { name: 'Class-Weighted Loss', detail: 'Inverse frequency weighting in CrossEntropyLoss: w_c = N / (C · N_c).' },
    { name: 'Lesion-Level Split', detail: 'Grouping by lesion_id across 10,015 images to eliminate patient data leakage.' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Overview & Architecture Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-teal-700">
          <Cpu className="w-5 h-5" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Convolutional Neural Network Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              EfficientNet-B0 Backbone
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              EfficientNet uses a compound scaling method that uniformly scales network depth, width, and resolution using a fixed compound coefficient $\phi$. The B0 baseline comprises 16 Mobile Inverted Bottleneck Convolution (MBConv) blocks equipped with squeeze-and-excitation optimization.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Input Shape</span>
              <span className="font-mono text-xs font-bold text-slate-800 block mt-0.5">224 × 224 × 3</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Output Classes</span>
              <span className="font-mono text-xs font-bold text-teal-700 block mt-0.5">7 Lesion Categories</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Feature Extractor</span>
              <span className="font-mono text-xs font-bold text-slate-800 block mt-0.5">1,280 Channels</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Classification Head</span>
              <span className="font-mono text-xs font-bold text-slate-800 block mt-0.5">Dropout(0.3) + Linear</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Benchmark Comparison Table (loaded from backend) */}
      <ModelComparisonTable models={metrics?.comparison} />

      {/* Training Strategy Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Training & Optimization Strategy</h3>
          <p className="text-xs text-slate-500">
            Techniques employed to address clinical imaging noise, optical variation, and class imbalance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {trainingStrategies.map((strat, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                <span>{strat.name}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">{strat.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
