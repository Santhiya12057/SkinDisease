import React, { useEffect, useState } from 'react';
import { FileImage, Trash2, RefreshCw, CheckCircle, ArrowRight, Activity } from 'lucide-react';

export default function ImagePreview({ file, previewUrl, onRemove, onChange, onAnalyze, isAnalyzing }) {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    if (previewUrl) {
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = previewUrl;
    }
  }, [previewUrl]);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Image Staged for Analysis</h3>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <CheckCircle className="w-3 h-3" /> Validated Dermoscopic Input
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Thumbnail preview */}
        <div className="md:col-span-4 flex justify-center">
          <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-900 w-full max-w-[260px] aspect-[4/3] flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Uploaded dermoscopic preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-slate-400 text-xs">
                <FileImage className="w-8 h-8 mb-1" />
                <span>No preview</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-slate-900/80 text-[10px] font-mono text-white">
              {dimensions ? `${dimensions.width} × ${dimensions.height}` : 'Loading...'}
            </div>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="md:col-span-8 flex flex-col justify-between space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Filename</span>
              <span className="text-xs font-mono font-medium text-slate-800 truncate block mt-0.5" title={file?.name}>
                {file?.name || 'dermoscopy_image.jpg'}
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Original Dims</span>
              <span className="text-xs font-mono font-medium text-slate-800 block mt-0.5">
                {dimensions ? `${dimensions.width} × ${dimensions.height} px` : 'Analyzing...'}
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">File Size</span>
              <span className="text-xs font-mono font-medium text-slate-800 block mt-0.5">
                {formatFileSize(file?.size)}
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Color Space</span>
              <span className="text-xs font-mono font-medium text-slate-800 block mt-0.5">
                RGB (3 channels)
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Model Input Target</span>
              <span className="text-xs font-mono font-medium text-teal-700 font-semibold block mt-0.5">
                224 × 224 × 3
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Normalization</span>
              <span className="text-xs font-mono font-medium text-slate-800 block mt-0.5">
                ImageNet Standard
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-sm shadow-teal-700/20 transition-all disabled:opacity-50"
            >
              <Activity className="w-4 h-4" />
              <span>Analyze Image with EfficientNet-B0</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onChange}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Change</span>
            </button>

            <button
              type="button"
              onClick={onRemove}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-medium text-xs transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
