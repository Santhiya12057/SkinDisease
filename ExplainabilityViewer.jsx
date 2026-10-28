import React, { useState } from 'react';
import { Eye, Layers, HelpCircle, AlertTriangle, Maximize2, ShieldAlert } from 'lucide-react';

export default function ExplainabilityViewer({ explainData, predictedClass, predictedLabel }) {
  const [activeView, setActiveView] = useState('side-by-side'); // 'side-by-side', 'overlay', 'heatmap', 'original'

  if (!explainData) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        <Eye className="w-8 h-8 mx-auto text-slate-400 mb-2" />
        <p className="text-sm font-medium text-slate-700">No explainability data available</p>
        <p className="text-xs text-slate-400 mt-1">Run analysis on an image to view Grad-CAM attention maps.</p>
      </div>
    );
  }

  const { original_image, heatmap, overlay, target_layer } = explainData;

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-teal-50 text-teal-700">
              <Eye className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Grad-CAM Visual Attention Localization
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Grad-CAM provides a visual indication of image regions that contributed to the model's prediction of{' '}
            <strong className="text-slate-800 font-semibold">{predictedLabel || predictedClass}</strong>.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80 text-xs self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveView('side-by-side')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeView === 'side-by-side'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Side-by-Side
          </button>
          <button
            type="button"
            onClick={() => setActiveView('overlay')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeView === 'overlay'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overlay
          </button>
          <button
            type="button"
            onClick={() => setActiveView('heatmap')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeView === 'heatmap'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Heatmap
          </button>
          <button
            type="button"
            onClick={() => setActiveView('original')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeView === 'original'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Original
          </button>
        </div>
      </div>

      {/* Main Image Viewer Stage */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        {activeView === 'side-by-side' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Original Dermoscopic Image</span>
                <span className="text-slate-400 font-mono text-[10px]">224 × 224</span>
              </div>
              <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-square flex items-center justify-center">
                <img
                  src={original_image}
                  alt="Original dermoscopic lesion"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Heatmap Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Grad-CAM Heatmap</span>
                <span className="text-teal-700 font-mono text-[10px]">features[-1]</span>
              </div>
              <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-square flex items-center justify-center">
                <img
                  src={heatmap}
                  alt="Grad-CAM activation heatmap"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {activeView === 'overlay' && (
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Alpha Blended Overlay (Heatmap on Original)</span>
              <span className="text-slate-500 font-mono text-[10px]">α = 0.45</span>
            </div>
            <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-square flex items-center justify-center">
              <img
                src={overlay}
                alt="Grad-CAM blended overlay"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {activeView === 'heatmap' && (
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Grad-CAM Activation Heatmap</span>
              <span className="text-teal-700 font-mono text-[10px]">features[-1]</span>
            </div>
            <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-square flex items-center justify-center">
              <img
                src={heatmap}
                alt="Grad-CAM activation heatmap"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {activeView === 'original' && (
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Normalized Original Image</span>
              <span className="text-slate-400 font-mono text-[10px]">224 × 224</span>
            </div>
            <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-square flex items-center justify-center">
              <img
                src={original_image}
                alt="Original dermoscopic image"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Intensity Legend */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto flex-1 max-w-sm space-y-1.5">
            <div className="flex justify-between text-[11px] font-medium text-slate-500">
              <span>Low contribution (0.0)</span>
              <span>High contribution (1.0)</span>
            </div>
            {/* Continuous gradient bar representing Jet colormap */}
            <div className="h-3 rounded-full overflow-hidden shadow-inner border border-slate-200" style={{
              background: 'linear-gradient(to right, #000080, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000, #800000)'
            }}></div>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Layer: <code className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{target_layer || 'features[-1]'}</code>
          </div>
        </div>
      </div>

      {/* Crucial Disclaimer */}
      <div className="bg-amber-50/80 rounded-xl border border-amber-200 p-4 flex items-start gap-3 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-950">Important Interpretability Disclaimer</h4>
          <p className="mt-0.5 leading-relaxed text-amber-850">
            Highlighted regions represent model attention patterns, not clinically validated diagnostic evidence. Grad-CAM visualizes the gradient flow of the winning class score into the final convolutional feature maps, illustrating which spatial structures were most salient to the neural network during inference.
          </p>
        </div>
      </div>

      {/* How Grad-CAM Works Explanatory Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          How Grad-CAM Computes Explainability
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="font-bold text-slate-800 mb-1">1. Gradient Backprop</div>
            Gradients of the predicted class score $Y^c$ are computed with respect to activation maps $A^k$ of the final conv layer.
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="font-bold text-slate-800 mb-1">2. Global Pooling</div>
            Spatial dimensions are globally pooled to calculate importance weights $\alpha_k^c$, quantifying each channel's contribution.
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="font-bold text-slate-800 mb-1">3. ReLU Activation</div>
            A weighted sum of feature maps is passed through ReLU to isolate features having a strictly positive impact on the category.
          </div>
        </div>
      </div>
    </div>
  );
}
