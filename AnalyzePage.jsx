import React, { useRef } from 'react';
import UploadCard from '../components/analysis/UploadCard';
import ImagePreview from '../components/analysis/ImagePreview';
import LoadingState from '../components/analysis/LoadingState';
import SampleSelector from '../components/analysis/SampleSelector';

export default function AnalyzePage({
  selectedFile,
  previewUrl,
  error,
  isAnalyzing,
  onImageSelected,
  onRemoveImage,
  onAnalyze,
  activeSampleId,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hidden file input for "Change Image" button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        className="hidden"
        onChange={handleFileChange}
      />

      {isAnalyzing ? (
        <LoadingState />
      ) : selectedFile ? (
        <div className="space-y-6">
          <ImagePreview
            file={selectedFile}
            previewUrl={previewUrl}
            onRemove={onRemoveImage}
            onChange={() => fileInputRef.current?.click()}
            onAnalyze={onAnalyze}
            isAnalyzing={isAnalyzing}
          />

          {/* Quick switch sample while one is staged */}
          <SampleSelector
            onSelectSample={onImageSelected}
            activeSampleId={activeSampleId}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <UploadCard
            onImageSelected={onImageSelected}
            error={error}
            isAnalyzing={isAnalyzing}
            selectedFile={selectedFile}
          />

          <SampleSelector
            onSelectSample={onImageSelected}
            activeSampleId={activeSampleId}
          />
        </div>
      )}
    </div>
  );
}
