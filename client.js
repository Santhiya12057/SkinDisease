// DermaVision AI API Client
const API_BASE = '/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend health check error:', err);
    return { status: 'offline', model: 'EfficientNet-B0', research_only: true };
  }
}

export async function fetchModelInfo() {
  const res = await fetch(`${API_BASE}/model-info`);
  if (!res.ok) throw new Error('Failed to fetch model info');
  return await res.json();
}

export async function fetchDatasetInfo() {
  const res = await fetch(`${API_BASE}/dataset-info`);
  if (!res.ok) throw new Error('Failed to fetch dataset info');
  return await res.json();
}

export async function fetchMetrics() {
  const res = await fetch(`${API_BASE}/metrics`);
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return await res.json();
}

export async function fetchSampleImages() {
  const res = await fetch(`${API_BASE}/sample-images`);
  if (!res.ok) throw new Error('Failed to fetch sample images');
  return await res.json();
}

export async function predictAndExplainImage(fileOrBlob) {
  const formData = new FormData();
  formData.append('image', fileOrBlob);

  const res = await fetch(`${API_BASE}/predict-and-explain`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to analyze image. Please verify it is a valid JPG or PNG.');
  }

  return await res.json();
}

export async function predictImage(fileOrBlob) {
  const formData = new FormData();
  formData.append('image', fileOrBlob);

  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Prediction failed.');
  }

  return await res.json();
}

export async function explainImage(fileOrBlob) {
  const formData = new FormData();
  formData.append('image', fileOrBlob);

  const res = await fetch(`${API_BASE}/explain`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Explainability failed.');
  }

  return await res.json();
}
