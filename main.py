import os
import json
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, Any

from model.classifier import SkinLesionClassifier, CLASS_KEYS, CLASS_NAMES, CLASS_DESCRIPTIONS
from model.gradcam import GradCAM, apply_colormap_and_overlay

# Base directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
SAMPLES_DIR = os.path.join(DATA_DIR, "sample_images")

# Initialize FastAPI application
app = FastAPI(
    title="DermaVision AI API",
    description="Explainable Deep Learning for Skin Lesion Classification API",
    version="1.0.0"
)

# CORS Configuration - allow all local dev origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load metadata JSON files
def load_json_file(filename: str):
    path = os.path.join(DATA_DIR, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

DATASET_INFO = load_json_file("dataset_info.json")
METRICS_DATA = load_json_file("metrics.json")

# Initialize Model & Grad-CAM Singleton
print("Initializing EfficientNet-B0 Model & Grad-CAM Hook...")
classifier = SkinLesionClassifier()
gradcam_engine = GradCAM(classifier.model)
print("EfficientNet-B0 initialized successfully.")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "DermaVision AI",
        "model": "EfficientNet-B0",
        "num_classes": len(CLASS_KEYS),
        "device": str(classifier.device),
        "research_only": True
    }

@app.get("/api/model-info")
def get_model_info():
    return {
        "model_name": "EfficientNet-B0",
        "architecture": "Compound scaled inverted residual convolutional neural network (MBConv blocks with Squeeze-and-Excitation)",
        "input_dimensions": "224x224x3",
        "normalization": {
            "mean": [0.485, 0.456, 0.406],
            "std": [0.229, 0.224, 0.225]
        },
        "target_classes": [
            {"key": k, "name": CLASS_NAMES[k], "description": CLASS_DESCRIPTIONS[k]}
            for k in CLASS_KEYS
        ],
        "training_strategy": {
            "loss_function": "Class-Weighted Cross-Entropy Loss",
            "optimizer": "AdamW (lr=1e-4, weight_decay=1e-2)",
            "data_augmentation": [
                "Random Horizontal & Vertical Flips (p=0.5)",
                "Random Affine Rotation (-30 deg to +30 deg)",
                "Color Jitter (Brightness=0.15, Contrast=0.15, Saturation=0.15)",
                "Bilinear Resizing to 224x224"
            ],
            "split_method": "Lesion-level grouping (grouping by lesion_id) to eliminate image leakage."
        },
        "explainability": {
            "method": "Grad-CAM (Gradient-weighted Class Activation Mapping)",
            "target_layer": "EfficientNet-B0 features[-1] (Conv2dNormActivation, 1280 feature channels)",
            "colormap": "Jet / Turbo with alpha overlay (alpha=0.45)"
        },
        "research_disclaimer": "Educational / Research Prototype — Predictions are not medical diagnoses."
    }

@app.get("/api/dataset-info")
def get_dataset_info():
    return DATASET_INFO

@app.get("/api/metrics")
def get_metrics():
    return METRICS_DATA

@app.get("/api/sample-images")
def get_sample_images():
    """
    Returns curated sample dermoscopic images that users can click to test immediately.
    """
    samples = [
        {
            "id": "sample_mel_01",
            "filename": "sample_mel_01.jpg",
            "class_key": "mel",
            "class_name": "Melanoma",
            "risk_category": "Malignant",
            "diameter": "7.4 mm",
            "dermoscopic_features": "Asymmetric pigment network, atypical globules, blue-white veil",
            "url": "/api/sample-images/sample_mel_01.jpg"
        },
        {
            "id": "sample_bcc_01",
            "filename": "sample_bcc_01.jpg",
            "class_key": "bcc",
            "class_name": "Basal Cell Carcinoma",
            "risk_category": "Malignant",
            "diameter": "6.1 mm",
            "dermoscopic_features": "Translucent pink nodule, arborizing telangiectasia, shiny white areas",
            "url": "/api/sample-images/sample_bcc_01.jpg"
        },
        {
            "id": "sample_nv_01",
            "filename": "sample_nv_01.jpg",
            "class_key": "nv",
            "class_name": "Melanocytic Nevus",
            "risk_category": "Benign",
            "diameter": "4.2 mm",
            "dermoscopic_features": "Uniform reticular pigment network, symmetric regular border",
            "url": "/api/sample-images/sample_nv_01.jpg"
        },
        {
            "id": "sample_bkl_01",
            "filename": "sample_bkl_01.jpg",
            "class_key": "bkl",
            "class_name": "Benign Keratolytic",
            "risk_category": "Benign",
            "diameter": "8.5 mm",
            "dermoscopic_features": "Verrucous surface, milia-like cysts, crypts, stuck-on appearance",
            "url": "/api/sample-images/sample_bkl_01.jpg"
        },
        {
            "id": "sample_akiec_01",
            "filename": "sample_akiec_01.jpg",
            "class_key": "akiec",
            "class_name": "Actinic Keratosis",
            "risk_category": "Pre-malignant",
            "diameter": "5.3 mm",
            "dermoscopic_features": "Erythematous background, strawberry pattern, keratotic follicular plugs",
            "url": "/api/sample-images/sample_akiec_01.jpg"
        },
        {
            "id": "sample_vasc_01",
            "filename": "sample_vasc_01.jpg",
            "class_key": "vasc",
            "class_name": "Vascular Lesion",
            "risk_category": "Benign",
            "diameter": "3.8 mm",
            "dermoscopic_features": "Well-demarcated round-oval red-purple lacunae, fibrous septa",
            "url": "/api/sample-images/sample_vasc_01.jpg"
        },
        {
            "id": "sample_df_01",
            "filename": "sample_df_01.jpg",
            "class_key": "df",
            "class_name": "Dermatofibroma",
            "risk_category": "Benign",
            "diameter": "5.0 mm",
            "dermoscopic_features": "Central white scar-like patch with fine peripheral pigment network",
            "url": "/api/sample-images/sample_df_01.jpg"
        }
    ]
    return samples

@app.get("/api/sample-images/{filename}")
def serve_sample_image(filename: str):
    file_path = os.path.join(SAMPLES_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Sample image not found")
    return FileResponse(file_path, media_type="image/jpeg")

@app.post("/api/predict")
async def predict_lesion(image: UploadFile = File(...)):
    """
    Classify dermoscopic skin lesion image using EfficientNet-B0.
    """
    try:
        content = await image.read()
        pil_img, width, height = classifier.validate_image(content, image.filename or "")
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception:
        raise HTTPException(status_code=400, detail="Unable to process the uploaded image. Please ensure it is a valid JPG or PNG.")

    try:
        prediction_result, _ = classifier.predict(pil_img)
        prediction_result["image_dimensions"] = f"{width}x{height}"
        prediction_result["filename"] = image.filename
        return prediction_result
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred during model inference. Please try another image.")

@app.post("/api/explain")
async def explain_lesion(image: UploadFile = File(...)):
    """
    Generate Grad-CAM activation heatmap and overlay visualization.
    """
    try:
        content = await image.read()
        pil_img, width, height = classifier.validate_image(content, image.filename or "")
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception:
        raise HTTPException(status_code=400, detail="Unable to process the uploaded image.")

    try:
        # Preprocess tensor
        input_tensor = classifier.transform(pil_img).unsqueeze(0).to(classifier.device)
        
        # Grad-CAM forward and backward pass
        cam_2d, target_class_idx = gradcam_engine.generate(input_tensor)
        
        # Color mapping and overlay
        viz = apply_colormap_and_overlay(pil_img, cam_2d, alpha=0.45)
        
        predicted_key = CLASS_KEYS[target_class_idx]
        
        return {
            "predicted_class": predicted_key,
            "predicted_label": CLASS_NAMES[predicted_key],
            "original_image": viz["original_image"],
            "heatmap": viz["heatmap"],
            "overlay": viz["overlay"],
            "target_layer": "EfficientNet-B0 features[-1] (1280 channels)",
            "research_only": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Grad-CAM visualization failed for this image.")

@app.post("/api/predict-and-explain")
async def predict_and_explain(image: UploadFile = File(...)):
    """
    Unified high-performance endpoint returning both classification result
    and Grad-CAM heatmap & overlay in a single request.
    """
    try:
        content = await image.read()
        pil_img, width, height = classifier.validate_image(content, image.filename or "")
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception:
        raise HTTPException(status_code=400, detail="Unable to process the uploaded image. Please ensure it is a valid JPG or PNG.")

    try:
        # 1. Prediction
        prediction_result, input_tensor = classifier.predict(pil_img)
        prediction_result["image_dimensions"] = f"{width}x{height}"
        prediction_result["filename"] = image.filename
        
        # 2. Grad-CAM for the predicted class
        top_class_idx = CLASS_KEYS.index(prediction_result["predicted_class"])
        cam_2d, _ = gradcam_engine.generate(input_tensor, target_class=top_class_idx)
        
        # 3. Colormap and Overlay
        viz = apply_colormap_and_overlay(pil_img, cam_2d, alpha=0.45)
        
        prediction_result["explainability"] = {
            "original_image": viz["original_image"],
            "heatmap": viz["heatmap"],
            "overlay": viz["overlay"],
            "target_layer": "EfficientNet-B0 features[-1] (Conv2dNormActivation, 1280 channels)"
        }
        
        return prediction_result
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while analyzing the image. Please try another image.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
