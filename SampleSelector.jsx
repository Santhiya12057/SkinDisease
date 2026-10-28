import React from 'react';
import { Sparkles, Layers, ShieldCheck, AlertCircle } from 'lucide-react';

export default function SampleSelector({ onSelectSample, activeSampleId }) {
  const samples = [
    {
      id: 'sample_mel_01',
      name: 'Melanoma',
      code: 'mel',
      type: 'Malignant Neoplasm',
      variant: 'danger',
      pattern: 'Asymmetric pigment network, blue-white veil',
      diameter: '7.4 mm',
      url: '/api/sample-images/sample_mel_01.jpg'
    },
    {
      id: 'sample_bcc_01',
      name: 'Basal Cell Carcinoma',
      code: 'bcc',
      type: 'Malignant Carcinoma',
      variant: 'danger',
      pattern: 'Arborizing telangiectasia, shiny white areas',
      diameter: '6.1 mm',
      url: '/api/sample-images/sample_bcc_01.jpg'
    },
    {
      id: 'sample_nv_01',
      name: 'Melanocytic Nevus',
      code: 'nv',
      type: 'Benign Mole',
      variant: 'success',
      pattern: 'Uniform pigment network, symmetric oval border',
      diameter: '4.2 mm',
      url: '/api/sample-images/sample_nv_01.jpg'
    },
    {
      id: 'sample_bkl_01',
      name: 'Benign Keratolytic',
      code: 'bkl',
      type: 'Seborrheic Keratosis',
      variant: 'success',
      pattern: 'Verrucous surface, milia-like cysts & crypts',
      diameter: '8.5 mm',
      url: '/api/sample-images/sample_bkl_01.jpg'
    },
    {
      id: 'sample_akiec_01',
      name: 'Actinic Keratosis',
      code: 'akiec',
      type: 'Pre-Malignant',
      variant: 'warning',
      pattern: 'Erythematous base, strawberry pattern',
      diameter: '5.3 mm',
      url: '/api/sample-images/sample_akiec_01.jpg'
    },
    {
      id: 'sample_vasc_01',
      name: 'Vascular Lesion',
      code: 'vasc',
      type: 'Cherry Angioma',
      variant: 'default',
      pattern: 'Red-purple lacunae, pale fibrous septa',
      diameter: '3.8 mm',
      url: '/api/sample-images/sample_vasc_01.jpg'
    },
    {
      id: 'sample_df_01',
      name: 'Dermatofibroma',
      code: 'df',
      type: 'Fibrous Histiocytoma',
      variant: 'default',
      pattern: 'Central white patch, delicate peripheral network',
      diameter: '5.0 mm',
      url: '/api/sample-images/sample_df_01.jpg'
    },
  ];

  const handlePick = async (sample) => {
    try {
      const res = await fetch(sample.url);
      const blob = await res.blob();
      const file = new File([blob], `${sample.id}.jpg`, { type: 'image/jpeg' });
      onSelectSample(file, sample);
    } catch (err) {
      console.error('Failed to load sample image:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-700" />
          <h4 className="text-xs font-bold text-slate-900 tracking-tight uppercase">
            Test With Curated Research Samples (1-Click)
          </h4>
        </div>
        <span className="text-[11px] text-slate-500">7 HAM10000 Categories</span>
      </div>

      <p className="text-xs text-slate-500 mb-3">
        Don't have a dermoscopy image ready? Select any representative skin lesion below to immediately run EfficientNet-B0 and Grad-CAM:
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {samples.map((s) => {
          const isSelected = activeSampleId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handlePick(s)}
              className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all duration-150 group hover:shadow-xs ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/70 ring-1 ring-teal-600'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                    {s.code}
                  </span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-semibold ${
                      s.variant === 'danger'
                        ? 'bg-rose-100 text-rose-800'
                        : s.variant === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {s.type.split(' ')[0]}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-teal-900 leading-tight">
                  {s.name}
                </div>
              </div>

              <div className="mt-2 text-[10px] text-slate-400 line-clamp-2 leading-snug">
                {s.pattern}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
