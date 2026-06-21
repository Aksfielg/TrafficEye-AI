import os
from ultralytics import YOLO

# Global variables to cache loaded models
_yolo_model = None
_helmet_model = None

# Classes of interest for general object detection
TARGET_CLASSES = {"person", "car", "motorcycle", "bus", "truck"}
# Expected classes for helmet detection (can vary based on training data)
HELMET_CLASSES = {"With Helmet", "Without Helmet"}

def get_yolo_model():
    """Lazily load the YOLOv8n pretrained model."""
    global _yolo_model
    if _yolo_model is None:
        _yolo_model = YOLO("yolov8n.pt")
    return _yolo_model

def get_helmet_model():
    """Lazily load the custom helmet detection model."""
    global _helmet_model
    if _helmet_model is None:
        # Construct absolute path to weights: backend/models/weights/helmet_best.pt
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        weights_path = os.path.join(base_dir, "models", "weights", "helmet_best.pt")
        
        if not os.path.exists(weights_path):
            print(f"\n[CRITICAL WARNING] Helmet model weights missing at: {weights_path}")
            print("Helmet detection will FAIL until this file is provided!\n")
            
        try:
            _helmet_model = YOLO(weights_path)
        except Exception as e:
            print(f"\n[CRITICAL WARNING] Failed to load helmet model: {e}\n")
            raise e
            
    return _helmet_model

def detect_objects(image_path: str):
    """
    Detects relevant objects (person, car, motorcycle, bus, truck) in an image.
    """
    model = get_yolo_model()
    # run inference
    results = model(image_path)
    
    detections = []
    
    # parse results
    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0].item())
            class_name = model.names[class_id]
            
            # Filter for specific vehicles/persons
            if class_name in TARGET_CLASSES:
                confidence = float(box.conf[0].item())
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                
                detections.append({
                    "class_name": class_name,
                    "confidence": confidence,
                    "bounding_box": {"x1": x1, "y1": y1, "x2": x2, "y2": y2}
                })
                
    return detections

def detect_helmets(image_path: str):
    """
    Detects helmet and no_helmet occurrences in an image.
    """
    model = get_helmet_model()
    # run inference
    results = model(image_path)
    
    detections = []
    
    # parse results
    print("--- RAW HELMET MODEL OUTPUT ---")
    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0].item())
            class_name = model.names[class_id]
            confidence = float(box.conf[0].item())
            
            print(f"Detected: '{class_name}' with confidence {confidence:.2f}")
            
            # Case insensitive check in case the model's classes are capitalized
            if class_name.lower() in [c.lower() for c in HELMET_CLASSES]:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                
                detections.append({
                    "class_name": class_name,
                    "confidence": confidence,
                    "bounding_box": {"x1": x1, "y1": y1, "x2": x2, "y2": y2}
                })
    print("-------------------------------")
                
    return detections
