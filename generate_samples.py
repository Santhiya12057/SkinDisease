import math
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def create_sample_dermoscopy_images():
    """
    Generates 7 representative dermoscopic images matching characteristic
    patterns of the 7 HAM10000 classes.
    """
    output_dir = os.path.join(os.path.dirname(__file__), "sample_images")
    os.makedirs(output_dir, exist_ok=True)
    
    samples_meta = [
        {
            "id": "sample_mel_01",
            "class_key": "mel",
            "title": "Melanoma (Superficial Spreading)",
            "diameter_mm": "7.4 mm",
            "pattern": "Atypical pigment network, irregular border, asymmetric pigmentation with focal blue-white veil.",
            "bg_color": (232, 204, 185),
            "lesion_type": "mel"
        },
        {
            "id": "sample_nv_01",
            "class_key": "nv",
            "title": "Melanocytic Nevus (Compound)",
            "diameter_mm": "4.2 mm",
            "pattern": "Homogeneous brownish pigment network, symmetric oval geometry, sharply defined perimeter.",
            "bg_color": (238, 212, 195),
            "lesion_type": "nv"
        },
        {
            "id": "sample_bcc_01",
            "class_key": "bcc",
            "title": "Basal Cell Carcinoma (Nodular)",
            "diameter_mm": "6.1 mm",
            "pattern": "Translucent pink-pearly nodule with prominent branching arborizing telangiectasias and shiny white areas.",
            "bg_color": (240, 215, 200),
            "lesion_type": "bcc"
        },
        {
            "id": "sample_bkl_01",
            "class_key": "bkl",
            "title": "Benign Keratolytic (Seborrheic Keratosis)",
            "diameter_mm": "8.5 mm",
            "pattern": "Verrucous 'stuck-on' plaque with multiple pseudofollicular openings, comedo-like openings, and milia-like cysts.",
            "bg_color": (235, 208, 190),
            "lesion_type": "bkl"
        },
        {
            "id": "sample_akiec_01",
            "class_key": "akiec",
            "title": "Actinic Keratosis (Solar Keratosis)",
            "diameter_mm": "5.3 mm",
            "pattern": "Erythematous scaly macule with strawberry pattern and targetoid follicular keratotic plugs.",
            "bg_color": (236, 195, 180),
            "lesion_type": "akiec"
        },
        {
            "id": "sample_vasc_01",
            "class_key": "vasc",
            "title": "Vascular Lesion (Cherry Angioma)",
            "diameter_mm": "3.8 mm",
            "pattern": "Multiple sharply demarcated round-to-oval red/purple vascular lacunae separated by pale fibrous septa.",
            "bg_color": (240, 216, 202),
            "lesion_type": "vasc"
        },
        {
            "id": "sample_df_01",
            "class_key": "df",
            "title": "Dermatofibroma (Fibrous Histiocytoma)",
            "diameter_mm": "5.0 mm",
            "pattern": "Characteristic central white scar-like patch surrounded by a delicate peripheral brownish pigment network.",
            "bg_color": (234, 207, 192),
            "lesion_type": "df"
        }
    ]
    
    size = (600, 450) # Native HAM10000 resolution
    center_x, center_y = size[0] // 2, size[1] // 2
    
    for meta in samples_meta:
        img = Image.new("RGB", size, meta["bg_color"])
        draw = ImageDraw.Draw(img)
        
        # Add subtle skin texture and vignette
        np_img = np.array(img, dtype=np.float32)
        noise = np.random.normal(0, 4.0, (size[1], size[0], 3))
        np_img = np.clip(np_img + noise, 0, 255).astype(np.uint8)
        img = Image.fromarray(np_img)
        draw = ImageDraw.Draw(img)
        
        l_type = meta["lesion_type"]
        
        if l_type == "nv":
            # Symmetric brownish oval
            rx, ry = 140, 115
            for layer in range(35, 0, -1):
                f = layer / 35.0
                c = (int(90 + 90 * f), int(55 + 90 * f), int(35 + 80 * f))
                draw.ellipse([center_x - rx * f, center_y - ry * f, center_x + rx * f, center_y + ry * f], fill=c)
            # Pigment network dots
            for _ in range(120):
                angle = np.random.uniform(0, 2 * math.pi)
                dist = np.random.uniform(0.1, 0.95)
                px = int(center_x + rx * dist * math.cos(angle))
                py = int(center_y + ry * dist * math.sin(angle))
                draw.ellipse([px-2, py-2, px+2, py+2], fill=(50, 30, 20))
                
        elif l_type == "mel":
            # Asymmetric jagged dark lesion with blue-white veil and atypical colors
            rx, ry = 175, 130
            # Base irregular polygon
            pts = []
            num_pts = 32
            for i in range(num_pts):
                ang = 2 * math.pi * i / num_pts
                rad = np.random.uniform(0.7, 1.3) * (rx if math.cos(ang) > 0 else rx * 1.15)
                pts.append((center_x + rad * math.cos(ang) + 15, center_y + rad * math.sin(ang) * 0.8))
            draw.polygon(pts, fill=(45, 25, 22))
            
            # Inner irregular dark zones
            for _ in range(5):
                sub_cx = center_x + np.random.randint(-50, 50)
                sub_cy = center_y + np.random.randint(-40, 40)
                draw.ellipse([sub_cx - 60, sub_cy - 45, sub_cx + 60, sub_cy + 45], fill=(20, 12, 10))
                
            # Blue-white veil patch
            draw.ellipse([center_x - 35, center_y - 25, center_x + 45, center_y + 35], fill=(130, 145, 175))
            # Peripheral radial streaks / globules
            for i in range(24):
                ang = 2 * math.pi * i / 24
                px = center_x + 130 * math.cos(ang)
                py = center_y + 100 * math.sin(ang)
                draw.ellipse([px - 4, py - 4, px + 4, py + 4], fill=(25, 15, 10))
                
        elif l_type == "bcc":
            # Pink translucent nodule with branching arborizing vessels
            rx, ry = 135, 110
            for layer in range(25, 0, -1):
                f = layer / 25.0
                c = (int(235 - 35 * (1-f)), int(160 - 30 * (1-f)), int(165 - 25 * (1-f)))
                draw.ellipse([center_x - rx * f, center_y - ry * f, center_x + rx * f, center_y + ry * f], fill=c)
            # Shiny white areas (chrysalis / shiny white lines)
            draw.line([center_x - 40, center_y - 20, center_x + 30, center_y + 15], fill=(255, 250, 250), width=3)
            draw.line([center_x - 10, center_y - 35, center_x + 20, center_y + 25], fill=(255, 250, 250), width=2)
            # Branching arborizing telangiectasias (red sharply focused blood vessels)
            vessel_color = (195, 30, 35)
            draw.line([center_x - 70, center_y + 10, center_x - 20, center_y - 15], fill=vessel_color, width=3)
            draw.line([center_x - 20, center_y - 15, center_x + 25, center_y - 45], fill=vessel_color, width=2)
            draw.line([center_x - 20, center_y - 15, center_x + 10, center_y + 20], fill=vessel_color, width=2)
            draw.line([center_x + 10, center_y + 20, center_x + 60, center_y + 35], fill=vessel_color, width=2)
            draw.line([center_x + 10, center_y + 20, center_x + 30, center_y + 60], fill=vessel_color, width=1)
            
        elif l_type == "bkl":
            # Verrucous brownish keratosis with milia cysts & crypts
            rx, ry = 150, 130
            for layer in range(25, 0, -1):
                f = layer / 25.0
                c = (int(130 - 30 * (1-f)), int(95 - 25 * (1-f)), int(60 - 20 * (1-f)))
                draw.ellipse([center_x - rx * f, center_y - ry * f, center_x + rx * f, center_y + ry * f], fill=c)
            # Multiple crypts / comedo-like openings
            for _ in range(40):
                px = center_x + np.random.randint(-110, 110)
                py = center_y + np.random.randint(-90, 90)
                draw.ellipse([px-4, py-4, px+4, py+4], fill=(45, 30, 20))
            # Milia-like tiny white cysts
            for _ in range(15):
                px = center_x + np.random.randint(-90, 90)
                py = center_y + np.random.randint(-70, 70)
                draw.ellipse([px-3, py-3, px+3, py+3], fill=(250, 248, 235))
                
        elif l_type == "akiec":
            # Erythematous scaly lesion with targetoid white keratoses
            rx, ry = 125, 100
            for layer in range(20, 0, -1):
                f = layer / 20.0
                c = (int(228 - 25 * (1-f)), int(130 - 25 * (1-f)), int(120 - 20 * (1-f)))
                draw.ellipse([center_x - rx * f, center_y - ry * f, center_x + rx * f, center_y + ry * f], fill=c)
            # Scaly yellowish/white surface hyperkeratosis
            for _ in range(30):
                px = center_x + np.random.randint(-85, 85)
                py = center_y + np.random.randint(-65, 65)
                draw.ellipse([px-5, py-3, px+5, py+3], fill=(245, 235, 205))
                
        elif l_type == "vasc":
            # Vascular lacunae (cluster of dark red/purple round pools)
            lacunae = [
                (-35, -20, 42, (180, 20, 45)),
                (25, -25, 38, (160, 15, 40)),
                (-15, 30, 40, (140, 10, 35)),
                (35, 25, 32, (190, 25, 50)),
                (0, 0, 35, (170, 18, 42))
            ]
            for dx, dy, rad, col in lacunae:
                draw.ellipse([center_x + dx - rad, center_y + dy - rad, center_x + dx + rad, center_y + dy + rad], fill=col)
                # subtle white fibrous septa outline
                draw.ellipse([center_x + dx - rad, center_y + dy - rad, center_x + dx + rad, center_y + dy + rad], outline=(235, 210, 205), width=2)
                
        elif l_type == "df":
            # Central white patch + peripheral delicate pigment ring
            rx, ry = 120, 95
            for layer in range(25, 0, -1):
                f = layer / 25.0
                c = (int(165 - 30 * (1-f)), int(115 - 25 * (1-f)), int(80 - 20 * (1-f)))
                draw.ellipse([center_x - rx * f, center_y - ry * f, center_x + rx * f, center_y + ry * f], fill=c)
            # Central white scar-like patch
            draw.ellipse([center_x - 38, center_y - 28, center_x + 38, center_y + 28], fill=(248, 245, 238))
            
        # Smooth with subtle Gaussian filter to match optical dermoscopy
        img = img.filter(ImageFilter.GaussianBlur(radius=1.2))
        
        # Save as JPEG
        filepath = os.path.join(output_dir, f"{meta['id']}.jpg")
        img.save(filepath, format="JPEG", quality=95)
        print(f"Generated sample: {filepath}")

if __name__ == "__main__":
    create_sample_dermoscopy_images()
