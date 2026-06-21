import cv2
import easyocr
import re
from typing import Dict, Optional

# Cache the EasyOCR reader instance so it is not reloaded per request
_reader = None

def get_reader():
    """Lazily load the EasyOCR reader."""
    global _reader
    if _reader is None:
        # Initialize EasyOCR with English language
        # It automatically falls back to CPU if no GPU is available
        _reader = easyocr.Reader(['en'], gpu=True)
    return _reader

def read_plate(image_path: str, vehicle_bbox: Dict[str, float]) -> Optional[str]:
    """
    Crops the image to the vehicle's bounding box region, runs EasyOCR,
    and returns the extracted license plate text if it matches an Indian format.
    """
    # Load the image
    image = cv2.imread(image_path)
    if image is None:
        print(f"Warning: Could not read image at {image_path}")
        return None
        
    height, width, _ = image.shape
    
    # Extract coordinates
    x1, y1 = int(vehicle_bbox['x1']), int(vehicle_bbox['y1'])
    x2, y2 = int(vehicle_bbox['x2']), int(vehicle_bbox['y2'])
    
    # Calculate padding (5% padding to capture edge plates without excessive background)
    pad_w = int((x2 - x1) * 0.05)
    pad_h = int((y2 - y1) * 0.05)
    
    # Apply padding while respecting image boundaries
    crop_x1 = max(0, x1 - pad_w)
    crop_y1 = max(0, y1 - pad_h)
    crop_x2 = min(width, x2 + pad_w)
    crop_y2 = min(height, y2 + pad_h)
    
    # Crop the image to the vehicle region
    cropped_img = image[crop_y1:crop_y2, crop_x1:crop_x2]
    
    if cropped_img.size == 0:
        return None
        
    # 1. Save crop for debugging
    import uuid
    import os
    os.makedirs("debug", exist_ok=True)
    debug_path = os.path.join("debug", f"crop_{uuid.uuid4().hex[:8]}.jpg")
    cv2.imwrite(debug_path, cropped_img)
        
    # Run inference with EasyOCR (lowering text_threshold to accept more text candidates)
    reader = get_reader()
    results = reader.readtext(cropped_img, text_threshold=0.2, low_text=0.3, min_size=10)
    
    print(f"\n--- RAW OCR OUTPUT for {debug_path} ---")
    for (bbox, text, prob) in results:
        print(f"Text: '{text}' | Conf: {prob:.2f}")
    print("---------------------------------------")
    
    best_text = None
    highest_conf = 0.0
    
    # Regex pattern: 2 letters, 2 digits, 1-2 letters, 4 digits (Standard Indian format)
    # Examples: RJ14CV0002 (10 chars), MH12A1234 (9 chars)
    strict_pattern = r"^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$"
    
    def correct_plate_chars(text: str) -> str:
        """Corrects common OCR confusions based on expected plate format."""
        if len(text) < 8 or len(text) > 10:
            return text
            
        corrected = list(text)
        l_to_n = {'O': '0', 'Q': '0', 'I': '1', 'L': '1', 'Z': '2', 'S': '5', 'B': '8', 'G': '6', 'A': '4', 'T': '7'}
        n_to_l = {'0': 'O', '1': 'I', '2': 'Z', '5': 'S', '8': 'B', '6': 'G', '4': 'A', '7': 'T'}
        
        # Pos 0-1: Letters
        for i in range(min(2, len(corrected))):
            if corrected[i] in n_to_l: corrected[i] = n_to_l[corrected[i]]
            
        # Pos 2-3: Numbers
        for i in range(2, min(4, len(corrected))):
            if corrected[i] in l_to_n: corrected[i] = l_to_n[corrected[i]]
            
        # Last 4: Numbers
        for i in range(max(4, len(corrected) - 4), len(corrected)):
            if corrected[i] in l_to_n: corrected[i] = l_to_n[corrected[i]]
            
        # Middle: Letters
        for i in range(4, len(corrected) - 4):
            if corrected[i] in n_to_l: corrected[i] = n_to_l[corrected[i]]
            
        return "".join(corrected)

    def find_plate_in_text(raw_text: str) -> Optional[str]:
        """Scans text for a valid plate, ignoring surrounding garbage."""
        clean_text = re.sub(r'[^A-Z0-9]', '', raw_text.upper())
        for length in [10, 9, 8]:
            for i in range(len(clean_text) - length + 1):
                substring = clean_text[i:i+length]
                corrected = correct_plate_chars(substring)
                if re.match(strict_pattern, corrected):
                    return corrected
        return None
    
    # Strategy 1: Check each OCR bounding box text independently
    for (bbox, text, prob) in results:
        found_plate = find_plate_in_text(text)
        if found_plate and prob > highest_conf:
            highest_conf = prob
            best_text = found_plate
                
    if best_text:
        return best_text
        
    # Strategy 2: Fallback for two-line plates (common on motorcycles)
    if len(results) > 1:
        # Sort results top-to-bottom (y-coordinate) then left-to-right (x-coordinate)
        results.sort(key=lambda x: (x[0][0][1], x[0][0][0]))
        
        # Concatenate all raw texts
        combined_text = "".join([res[1] for res in results])
        found_plate = find_plate_in_text(combined_text)
        if found_plate:
            return found_plate

    # Return None if no plausible plate text is found
    return None
