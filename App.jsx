import React, { useEffect, useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DisclaimerBanner from './components/layout/DisclaimerBanner';

import DashboardPage from './pages/DashboardPage';
import AnalyzePage from './pages/AnalyzePage';
import ResultsPage from './pages/ResultsPage';
import ExplainabilityPage from './pages/ExplainabilityPage';
import ModelInsightsPage from './pages/ModelInsightsPage';
import DatasetPage from './pages/DatasetPage';
import ResultsAnalyticsPage from './pages/ResultsAnalyticsPage';
import AboutPage from './pages/AboutPage';

import {
  fetchHealth,
  fetchModelInfo,
  fetchDatasetInfo,
  fetchMetrics,
  predictAndExplainImage,
} from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeSampleId, setActiveSampleId] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [explainData, setExplainData] = useState(null);
  const [error, setError] = useState(null);

  // Metadata from backend API
  const [modelInfo, setModelInfo] = useState(null);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [backendOnline, setBackendOnline] = useState(false);

  // Initial load
  useEffect(() => {
    async function loadInitialData() {
      try {
        const health = await fetchHealth();
        setBackendOnline(health.status === 'healthy');

        const [mInfo, dInfo, met] = await Promise.allSettled([
          fetchModelInfo(),
          fetchDatasetInfo(),
          fetchMetrics(),
        ]);

        if (mInfo.status === 'fulfilled') setModelInfo(mInfo.value);
        if (dInfo.status === 'fulfilled') setDatasetInfo(dInfo.value);
        if (met.status === 'fulfilled') setMetrics(met.value);
      } catch (err) {
        console.warn('Initial backend fetch warning:', err);
      }
    }

    loadInitialData();
  }, []);

  // Handle image selection
  const handleImageSelected = (file, sampleMeta = null) => {
    setError(null);

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError(`File size exceeds 10 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB). Please select a smaller image.`);
      return;
    }

    // Validate format
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpe?g|png)$/i)) {
      setError('Please upload a valid JPG or PNG dermoscopic image.');
      return;
    }

    setSelectedFile(file);
    if (sampleMeta) {
      setActiveSampleId(sampleMeta.id);
    } else {
      setActiveSampleId(null);
    }

    // Generate object URL for preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setActiveSampleId(null);
    setError(null);
  };

  // Run Inference & Grad-CAM
  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select or drop a dermoscopic image first.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await predictAndExplainImage(selectedFile);
      setAnalysisResult(response);
      if (response.explainability) {
        setExplainData(response.explainability);
      }
      setActiveTab('results');
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.message || "We couldn't complete the analysis. Please try another image.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasResult={!!analysisResult}
        backendOnline={backendOnline}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Disclaimer Banner */}
        <DisclaimerBanner />

        {/* Global Header */}
        <Header
          activeTab={activeTab}
          onQuickAnalyze={() => setActiveTab('analyze')}
        />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardPage
              onNavigate={setActiveTab}
              onSelectSample={handleImageSelected}
            />
          )}

          {activeTab === 'analyze' && (
            <AnalyzePage
              selectedFile={selectedFile}
              previewUrl={previewUrl}
              error={error}
              isAnalyzing={isAnalyzing}
              onImageSelected={handleImageSelected}
              onRemoveImage={handleRemoveImage}
              onAnalyze={handleAnalyze}
              activeSampleId={activeSampleId}
            />
          )}

          {activeTab === 'results' && (
            <ResultsPage
              result={analysisResult}
              onExploreGradcam={() => setActiveTab('explainability')}
              onNewAnalysis={() => setActiveTab('analyze')}
            />
          )}

          {activeTab === 'explainability' && (
            <ExplainabilityPage
              explainData={explainData}
              result={analysisResult}
              onNewAnalysis={() => setActiveTab('analyze')}
            />
          )}

          {activeTab === 'insights' && (
            <ModelInsightsPage
              modelInfo={modelInfo}
              metrics={metrics}
            />
          )}

          {activeTab === 'dataset' && (
            <DatasetPage
              datasetInfo={datasetInfo}
            />
          )}

          {activeTab === 'analytics' && (
            <ResultsAnalyticsPage
              metrics={metrics}
            />
          )}

          {activeTab === 'about' && (
            <AboutPage />
          )}
        </main>
      </div>
    </div>
  );
}
