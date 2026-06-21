import requests
import time
import os

files_dir = "uploads"
target_file = None
for f in os.listdir(files_dir):
    if f.startswith("a184e79e-6e3c-4cb0-9e81-935bba38d5be"):
        target_file = os.path.join(files_dir, f)
        break

if target_file:
    print(f"Uploading {target_file} 3 times...")
    for i in range(3):
        with open(target_file, "rb") as img:
            print(f"Upload {i+1}...")
            r = requests.post("http://localhost:8000/api/analyze/", files={"file": img})
            print(r.status_code)
            try:
                print(r.json())
            except Exception as e:
                print(e)
        time.sleep(3)
else:
    print("Target file not found")
