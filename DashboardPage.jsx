import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Layers,
  Database,
  Eye,
  CheckCircle2,
  Scan,
  UploadCloud,
  FileCheck2,
  Activity
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import SampleSelector from '../components/analysis/SampleSelector';

export default function DashboardPage({ onNavigate, onSelectSample }) {
  const steps = [
    {
      num: '01',
      title: 'Upload',
      desc: 'Upload a standard dermoscopic JPG or PNG skin lesion photograph.',
      icon: UploadCloud,
    },
    {
      num: '02',
      title: 'Preprocess',
      desc: 'The image is resized to 224×224 and normalized via ImageNet mean & standard deviation.',
      icon: Scan,
    },
    {
      num: '03',
      title: 'Classify',
      desc: 'EfficientNet-B0 extracts hierarchical convolutional features and generates 7-class probabilities.',
      icon: Cpu,
    },
    {
      num: '04',
      title: 'Explain',
      desc: 'Grad-CAM computes spatial gradient weights to highlight salient regions driving the inference.',
      icon: Eye,
    },
    {
      num: '05',
      title: 'Review',
      desc: 'Examine predicted class, calibrated confidence, probability distribution, and educational notes.',
      icon: FileCheck2,
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-slate-50/70 rounded-2xl border border-slate-200/90 p-8 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-850 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-teal-600"></span>
            Deep Learning Clinical Research Prototype
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Understand Skin Lesions Through Explainable AI
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
            An educational deep learning platform demonstrating image-based skin lesion classification using{' '}
            <strong className="font-semibold text-slate-800">EfficientNet-B0</strong> and visual{' '}
            <strong className="font-semibold text-slate-800">Grad-CAM</strong> explainability across 7 diagnostic categories from the landmark HAM10000 dataset.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('analyze')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-teal-700/20 transition-all hover:translate-y-[-1px]"
            >
              <span>Analyze an Image</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('insights')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs sm:text-sm transition-colors"
            >
              <span>Explore Model</span>
            </button>
          </div>

          {/* Compact Research Disclaimer */}
          <div className="pt-3 flex items-center gap-2 text-xs text-amber-850">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong className="font-semibold">Educational / Research Prototype</strong> — Predictions are not medical diagnoses.
            </span>
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50/50 rounded-full blur-3xl -z-0 pointer-events-none transform translate-x-20 -translate-y-20"></div>
      </div>

      {/* 5 Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <StatCard
          title="Architecture"
          value="EfficientNet-B0"
          subtitle="Compound scaled CNN"
          icon={Cpu}
        />
        <StatCard
          title="Diagnostic Classes"
          value="7"
          subtitle="HAM10000 taxonomy"
          icon={Layers}
        />
        <StatCard
          title="Benchmark Dataset"
          value="HAM10000"
          subtitle="10,015 dermoscopies"
          icon={Database}
        />
        <StatCard
          title="Input Resolution"
          value="224 × 224"
          subtitle="ImageNet normalized"
          icon={Scan}
        />
        <StatCard
          title="Explainability"
          value="Grad-CAM"
          subtitle="features[-1] attention"
          icon={Eye}
        />
      </div>

      {/* Quick Launch Curated Samples */}
      <SampleSelector
        onSelectSample={(file, sample) => {
          onSelectSample(file, sample);
          onNavigate('analyze');
        }}
      />

      {/* "How It Works" 5-Step Workflow Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="max-w-2xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
            Methodology & Pipeline
          </span>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            How the Classification & Explainability Workflow Operates
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            A transparent 5-stage inference pipeline designed for explainable clinical education.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                      {step.num}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 tracking-tight">{step.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
