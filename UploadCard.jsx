import React, { useRef, useState } from 'react';
import { UploadCloud, FileImage, AlertCircle, Sparkles } from 'lucide-react';

export default function UploadCard({ onImageSelected, error, isAnalyzing, selectedFile }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onImageSelected(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Upload Dermoscopic Image</h3>
          <p className="text-xs text-slate-500">Upload a JPG or PNG dermoscopic photograph for research classification.</p>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
          Max 10 MB
        </span>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-150 ${
          isDragOver
            ? 'border-teal-500 bg-teal-50/50'
            : selectedFile
            ? 'border-teal-300 bg-teal-50/20'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3 rounded-full bg-white border border-slate-200 text-teal-700 shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">
              <span className="text-teal-700 underline underline-offset-2">Click to browse</span> or drag and drop image here
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports standard dermoscopic formats: JPG, JPEG, PNG (up to 10 MB)
            </p>
          </div>
        </div>
      </div>

      {/* Inline Validation Error */}
      {error && (
        <div className="mt-3 flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}
    </div>
  );
}
