import React from 'react';
import {
  Info,
  Layers,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  Code2,
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function AboutPage() {
  const approachSteps = [
    { num: '01', title: 'Dataset Preparation', desc: 'Acquisition and metadata validation of 10,015 HAM10000 dermoscopic images.' },
    { num: '02', title: 'Lesion-Level Splitting', desc: 'Grouping by lesion_id into 70% train, 15% validation, and 15% test partitions.' },
    { num: '03', title: 'Image Preprocessing', desc: 'Bilinear downsampling to 224×224 and per-channel ImageNet RGB normalization.' },
    { num: '04', title: 'Data Augmentation', desc: 'Affine rotation, random flips, and color jitter to improve rotational invariance.' },
    { num: '05', title: 'Custom CNN Baseline', desc: 'Benchmarking a 4-layer convolutional network trained from scratch.' },
    { num: '06', title: 'EfficientNet-B0 Transfer', desc: 'Adapting ImageNet-pretrained compound scaling architecture with custom 7-class linear head.' },
    { num: '07', title: 'Class-Weighted Fine-Tuning', desc: 'Penalizing misclassifications inversely proportional to minority class support.' },
    { num: '08', title: 'Comprehensive Evaluation', desc: 'Held-out validation calculating macro F1, sensitivity, and 7×7 confusion matrix.' },
    { num: '09', title: 'Grad-CAM Explainability', desc: 'Extracting layer features[-1] activation maps and backpropagated class gradients.' },
    { num: '10', title: 'Full-Stack Deployment', desc: 'Responsive clinical-AI dashboard in React + Vite connected to Python API server.' },
  ];

  const pipelineStages = [
    'HAM10000 (10,015)',
    'Data Validation',
    'Lesion-Level Split',
    'Preprocessing',
    'Data Augmentation',
    'Custom CNN Baseline',
    'EfficientNet-B0',
    'Class-Weighted Training',
    'Fine-Tuning',
    'Evaluation',
    'Grad-CAM',
    'FastAPI / Backend',
    'React Web Application'
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-teal-700">
          <GraduationCap className="w-5 h-5" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Academic Research Project Documentation
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          DermaVision AI
        </h1>
        <p className="text-base text-slate-600 font-medium">
          Explainable Deep Learning for Skin Lesion Classification
        </p>

        <p className="text-xs text-slate-500 leading-relaxed max-w-3xl pt-2">
          Designed as a university-grade deep learning demonstration prototype illustrating how transfer learning with compound scaled convolutional networks and gradient-weighted class activation mapping (Grad-CAM) can perform automated, transparent multi-class classification of dermoscopic skin lesions.
        </p>
      </div>

      {/* Problem & Objective Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">The Clinical Problem</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Skin lesion image classification is a notoriously difficult multi-class computer vision challenge. Dermatoscopic images feature significant visual intra-class variance, subtle inter-class boundaries, irregular skin artifacts (hair, ruler marks, air bubbles), and extreme class imbalance where benign nevi outnumber malignant melanomas and dermatofibromas by up to 60 to 1.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Research Objective</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Develop, evaluate, and interpret a deep learning pipeline capable of classifying dermoscopic images into seven predefined diagnostic lesion categories from the HAM10000 collection, while providing interpretable visual attention heatmaps that demystify convolutional feature extraction for students, clinicians, and researchers.
          </p>
        </div>
      </div>

      {/* Technical Pipeline Flow */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">End-to-End Technical Pipeline</h3>
        <p className="text-xs text-slate-500">
          Sequential data flow from raw dermoscopic repositories to web deployment.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          {pipelineStages.map((stage, idx) => (
            <React.Fragment key={idx}>
              <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                {stage}
              </div>
              {idx < pipelineStages.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 10-Step Approach Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Methodological Approach (10 Steps)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {approachSteps.map((step) => (
            <div key={step.num} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-3">
              <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60 mt-0.5">
                {step.num}
              </span>
              <div>
                <div className="text-xs font-bold text-slate-900">{step.title}</div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Medical Disclaimer & Ethics */}
      <div className="bg-amber-50/80 rounded-xl border border-amber-200 p-6 space-y-3 text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-700" />
          <h4 className="font-bold text-amber-950 text-sm">
            Ethical AI Rationale & Medical Disclaimer
          </h4>
        </div>
        <p className="leading-relaxed text-amber-850">
          This system is strictly an academic research and educational prototype. Computer vision models trained on public datasets like HAM10000 exhibit known domain biases, including reduced accuracy on dark Fitzpatrick skin phototypes (due to dataset underrepresentation), sensitivity to lighting variation, and potential overconfidence on unfamiliar optical artifacts.
        </p>
        <p className="leading-relaxed font-semibold text-amber-950">
          Under no circumstances should the outputs of DermaVision AI be utilized as diagnostic advice, clinical triage, or replacement for examination by board-certified dermatologists.
        </p>
      </div>
    </div>
  );
}
