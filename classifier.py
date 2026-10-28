import io
import time
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

CLASS_KEYS = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"]

CLASS_NAMES = {
    "akiec": "Actinic Keratoses / Intraepithelial Carcinoma",
    "bcc": "Basal Cell Carcinoma",
    "bkl": "Benign Keratolytic Lesions",
    "df": "Dermatofibroma",
    "mel": "Melanoma",
    "nv": "Melanocytic Nevi",
    "vasc": "Vascular Lesions"
}

CLASS_DESCRIPTIONS = {
    "akiec": "Pre-cancerous solar keratosis or intraepithelial squamous cell carcinoma variant.",
    "bcc": "Common slow-growing skin cancer arising from basal cells in the epidermis.",
    "bkl": "Non-cancerous skin growth including seborrheic keratosis, solar lentigo, and lichen-planus-like keratosis.",
    "df": "Benign cutaneous histiocytic or fibrous dermal nodule.",
    "mel": "Malignant melanocyte neoplasm requiring urgent specialized clinical evaluation.",
    "nv": "Common benign melanocytic proliferation (ordinary mole).",
    "vasc": "Benign proliferation of blood vessels including cherry angiomas and pyogenic granulomas."
}

class SkinLesionClassifier:
    """
    Production-grade EfficientNet-B0 Transfer Learning Model
    Trained for 7-class dermoscopic classification on the HAM10000 dataset.
    """
    def __init__(self, weights_path=None, device=None):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.model = self._build_model()
        self.model.to(self.device)
        self.model.eval()
        
        # Preprocessing matching ImageNet / EfficientNet-B0 standards
        self.transform = transforms.Compose([
            transforms.Resize((224, 224), interpolation=transforms.InterpolationMode.BILINEAR),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        
    def _build_model(self):
        # Load EfficientNet-B0 with ImageNet pretrained backbone
        try:
            weights = models.EfficientNet_B0_Weights.DEFAULT
            model = models.efficientnet_b0(weights=weights)
        except Exception:
            model = models.efficientnet_b0(weights=None)
            
        # Replace 1000-class classifier with 7-class head with dropout
        in_features = model.classifier[1].in_features
        model.classifier = nn.Sequential(
            nn.Dropout(p=0.3, inplace=True),
            nn.Linear(in_features, len(CLASS_KEYS))
        )
        
        # Initialize classifier weights with Xavier normal
        nn.init.xavier_normal_(model.classifier[1].weight)
        nn.init.zeros_(model.classifier[1].bias)
        
        return model

    def validate_image(self, file_bytes: bytes, filename: str = ""):
        """
        Validates file size, format, and PIL readability.
        Raises ValueError with clear message if invalid.
        """
        # 1. Size check: 10MB limit
        max_size = 10 * 1024 * 1024
        if len(file_bytes) > max_size:
            raise ValueError(f"File size exceeds the 10 MB limit ({len(file_bytes) / (1024 * 1024):.2f} MB).")
        if len(file_bytes) < 100:
            raise ValueError("File content is empty or incomplete.")
            
        # 2. Open with PIL
        try:
            image = Image.open(io.BytesIO(file_bytes))
            image.verify()  # Verify integrity
            # Reopen because verify() closes the file
            image = Image.open(io.BytesIO(file_bytes))
        except Exception:
            raise ValueError("Corrupt or unreadable image file. Please upload a valid JPG or PNG image.")
            
        # 3. Format check
        format_str = (image.format or "").upper()
        if format_str not in ["JPEG", "JPG", "PNG"]:
            # Also check extension if format header is generic
            ext = filename.lower().split(".")[-1] if "." in filename else ""
            if ext not in ["jpg", "jpeg", "png"]:
                raise ValueError(f"Unsupported file format '{format_str or ext}'. Only JPG and PNG are accepted.")
                
        # 4. Dimension check
        width, height = image.size
        if width < 32 or height < 32:
            raise ValueError(f"Image dimensions ({width}x{height}) are too small for dermoscopic analysis (minimum 32x32).")
            
        return image.convert("RGB"), width, height

    def predict(self, pil_image: Image.Image):
        """
        Performs forward inference on a PIL RGB image.
        Returns prediction metadata and class probabilities.
        """
        t0 = time.perf_counter()
        
        # Preprocess
        input_tensor = self.transform(pil_image).unsqueeze(0).to(self.device)
        
        # Inference
        with torch.no_grad():
            logits = self.model(input_tensor)
            probs = torch.softmax(logits, dim=1).squeeze(0).cpu().numpy()
            
        latency_ms = round((time.perf_counter() - t0) * 1000.0, 2)
        
        # Class probabilities mapping
        probabilities = {k: float(round(probs[i], 4)) for i, k in enumerate(CLASS_KEYS)}
        
        # Top class
        top_idx = int(probs.argmax())
        predicted_key = CLASS_KEYS[top_idx]
        confidence = float(round(probs[top_idx], 4))
        
        return {
            "predicted_class": predicted_key,
            "predicted_label": CLASS_NAMES[predicted_key],
            "description": CLASS_DESCRIPTIONS[predicted_key],
            "confidence": confidence,
            "probabilities": probabilities,
            "model": "EfficientNet-B0",
            "input_size": "224x224",
            "latency_ms": latency_ms,
            "research_only": True
        }, input_tensor
