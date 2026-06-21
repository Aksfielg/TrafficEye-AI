import os
import urllib.request

# Ensure the directory exists
weights_dir = os.path.join("models", "weights")
os.makedirs(weights_dir, exist_ok=True)

target_path = os.path.join(weights_dir, "helmet_best.pt")

# Direct download link from Hugging Face (Highly reliable)
url = "https://huggingface.co/iam-tsr/yolov8n-helmet-detection/resolve/main/best.pt"

print("Downloading helmet detection weights from Hugging Face... This might take a minute...")
try:
    urllib.request.urlretrieve(url, target_path)
    print(f"Success! Model saved exactly where it needs to be: {target_path}")
except Exception as e:
    print(f"Download failed: {e}")