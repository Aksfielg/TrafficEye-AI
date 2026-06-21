import requests
import cv2
import numpy as np
import time

# Create a dummy image
img = np.zeros((1000, 1000, 3), dtype=np.uint8)
cv2.imwrite("dummy_test.jpg", img)

print("Waiting for server to start...")
time.sleep(10) # wait for uvicorn to start

import os

print("Testing specific images...")
files_to_test = [
    "037b69a2-8d7f-4ee9-aa21-2a5128f41a32_source.png", 
    "a184e79e-6e3c-4cb0-9e81-935bba38d5be_source.png"
]
for filename in files_to_test:
    if os.path.exists(f"uploads/{filename}"):
        try:
            print(f"\n--- Testing {filename} ---")
            with open(f"uploads/{filename}", "rb") as f:
                files = {"file": (filename, f, "image/png")}
                response = requests.post("http://localhost:8001/api/analyze/", files=files)

            if response.status_code == 200:
                violations = response.json()['violations']
                types = [v['violation_type'] if 'violation_type' in v else v.get('type') for v in violations]
                print(f"Violations: {len(violations)} -> {types}")
            else:
                print(f"Error: {response.text[:200]}")
        except Exception as e:
            print(f"Failed to request: {e}")
