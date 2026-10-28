import urllib.request
import json
import os

def test_api():
    print("--- 1. Health Check ---")
    req = urllib.request.urlopen("http://127.0.0.1:8000/api/health")
    health = json.loads(req.read().decode())
    print("Health:", health)
    assert health["status"] == "healthy"

    print("\n--- 2. Dataset Info ---")
    req = urllib.request.urlopen("http://127.0.0.1:8000/api/dataset-info")
    ds = json.loads(req.read().decode())
    print("Dataset:", ds["dataset_name"], "Total images:", ds["total_images"])
    assert ds["total_images"] == 10015

    print("\n--- 3. Metrics ---")
    req = urllib.request.urlopen("http://127.0.0.1:8000/api/metrics")
    metrics = json.loads(req.read().decode())
    print("Models compared:", [m["model_name"] for m in metrics["comparison"]])
    assert len(metrics["comparison"]) == 3

    print("\n--- 4. Sample Images List ---")
    req = urllib.request.urlopen("http://127.0.0.1:8000/api/sample-images")
    samples = json.loads(req.read().decode())
    print(f"Loaded {len(samples)} sample images.")
    assert len(samples) >= 7

    print("\n--- 5. Predict and Explain Test (sample_mel_01.jpg) ---")
    img_path = "backend/data/sample_images/sample_mel_01.jpg"
    with open(img_path, "rb") as f:
        img_bytes = f.read()

    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    data = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="image"; filename="sample_mel_01.jpg"\r\n'
        f"Content-Type: image/jpeg\r\n\r\n"
    ).encode("latin-1") + img_bytes + f"\r\n--{boundary}--\r\n".encode("latin-1")

    post_req = urllib.request.Request(
        "http://127.0.0.1:8000/api/predict-and-explain",
        data=data,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
    )

    res = json.loads(urllib.request.urlopen(post_req).read().decode())
    print("Predicted Class:", res["predicted_class"])
    print("Predicted Label:", res["predicted_label"])
    print("Confidence:", res["confidence"])
    print("Latency:", res["latency_ms"], "ms")
    print("Probabilities:", res["probabilities"])
    print("Grad-CAM Original Image Data URL length:", len(res["explainability"]["original_image"]))
    print("Grad-CAM Heatmap Data URL length:", len(res["explainability"]["heatmap"]))
    print("Grad-CAM Overlay Data URL length:", len(res["explainability"]["overlay"]))
    assert res["predicted_class"] in ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"]
    assert res["explainability"]["heatmap"].startswith("data:image/png;base64,")
    assert res["explainability"]["overlay"].startswith("data:image/png;base64,")

    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_api()
