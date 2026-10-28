import io
import base64
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image

def get_jet_colormap():
    """
    Generate a 256-color Jet colormap lookup table in RGB [0, 255].
    Avoids heavy external dependencies like OpenCV/matplotlib for pure, fast rendering.
    """
    lut = np.zeros((256, 3), dtype=np.uint8)
    for i in range(256):
        v = i / 255.0
        # Jet colormap formula:
        r = np.clip(1.5 - np.abs(4.0 * v - 3.0), 0.0, 1.0)
        g = np.clip(1.5 - np.abs(4.0 * v - 2.0), 0.0, 1.0)
        b = np.clip(1.5 - np.abs(4.0 * v - 1.0), 0.0, 1.0)
        lut[i] = [int(r * 255), int(g * 255), int(b * 255)]
    return lut

JET_LUT = get_jet_colormap()

class GradCAM:
    """
    Gradient-weighted Class Activation Mapping (Grad-CAM)
    Targeted for EfficientNet-B0's final convolutional layer (features[-1]).
    """
    def __init__(self, model, target_layer=None):
        self.model = model
        self.model.eval()
        self.target_layer = target_layer if target_layer is not None else model.features[-1]
        
        self.activations = None
        self.gradients = None
        
        self._register_hooks()
        
    def _register_hooks(self):
        def forward_hook(module, input, output):
            self.activations = output.detach()
            
        def backward_hook(module, grad_input, grad_output):
            self.gradients = grad_output[0].detach()
            
        self.target_layer.register_forward_hook(forward_hook)
        self.target_layer.register_full_backward_hook(backward_hook)
        
    def generate(self, input_tensor, target_class=None):
        """
        Generates 2D normalized activation map for the given input_tensor (1, 3, 224, 224)
        """
        self.model.zero_grad()
        output = self.model(input_tensor)
        
        if target_class is None:
            target_class = torch.argmax(output, dim=1).item()
            
        target_score = output[0, target_class]
        target_score.backward(retain_graph=True)
        
        # Global Average Pooling of gradients across spatial dimensions
        # self.gradients: [1, C, H, W]
        weights = torch.mean(self.gradients, dim=(2, 3), keepdim=True)
        
        # Weighted combination of forward activation maps
        cam = torch.sum(weights * self.activations, dim=1, keepdim=True)
        
        # Apply ReLU to retain only positive influences on target class
        cam = F.relu(cam)
        
        # Resize to input tensor spatial size (224, 224)
        cam = F.interpolate(cam, size=(input_tensor.size(2), input_tensor.size(3)), mode='bilinear', align_corners=False)
        cam = cam.squeeze().cpu().numpy()
        
        # Min-max normalization
        min_val = np.min(cam)
        max_val = np.max(cam)
        if max_val - min_val > 1e-8:
            cam = (cam - min_val) / (max_val - min_val)
        else:
            cam = np.zeros_like(cam)
            
        return cam, target_class

def apply_colormap_and_overlay(original_pil_image, cam_2d, alpha=0.45):
    """
    Applies Jet colormap to 2D CAM array and blends with the original dermoscopic image.
    Returns:
      - heatmap_data_url: base64 data URL for standalone heatmap
      - overlay_data_url: base64 data URL for overlay
      - original_data_url: base64 data URL for original image
    """
    # Resize original image to 224x224 for consistent 1:1 overlay visualization
    orig_resized = original_pil_image.convert("RGB").resize((224, 224), Image.Resampling.BILINEAR)
    orig_np = np.array(orig_resized, dtype=np.uint8)
    
    # Scale CAM to 0-255 indices
    cam_scaled = np.clip(cam_2d * 255.0, 0, 255).astype(np.uint8)
    
    # Apply Jet color lookup table
    heatmap_np = JET_LUT[cam_scaled]
    
    # Create overlay: alpha * heatmap + (1 - alpha) * original
    overlay_np = (alpha * heatmap_np + (1.0 - alpha) * orig_np).astype(np.uint8)
    
    # Helper to convert numpy RGB or PIL Image to Base64 PNG data URL
    def to_base64_url(img_or_arr):
        if isinstance(img_or_arr, np.ndarray):
            img = Image.fromarray(img_or_arr)
        else:
            img = img_or_arr
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{b64}"
        
    return {
        "original_image": to_base64_url(orig_resized),
        "heatmap": to_base64_url(heatmap_np),
        "overlay": to_base64_url(overlay_np)
    }
