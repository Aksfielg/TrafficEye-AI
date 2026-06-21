import cv2
import os
from typing import List, Dict, Any

def generate_evidence_image(image_path: str, violations: List[Dict[str, Any]], output_path: str) -> str:
    """
    Loads the original image, draws a red bounding box around each violation
    with a labeled filled background above the box, and saves the evidence image.
    """
    # 1. Load the original image
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not load image from {image_path}")
        
    # BGR format for OpenCV
    box_color = (0, 0, 255) # Red
    text_color = (255, 255, 255) # White
    
    for violation in violations:
        # Check if the violation dict contains a bounding box
        if 'bounding_box' not in violation:
            continue
            
        bbox = violation['bounding_box']
        x1, y1 = int(bbox['x1']), int(bbox['y1'])
        x2, y2 = int(bbox['x2']), int(bbox['y2'])
        
        # 2. Draw a red bounding box
        cv2.rectangle(image, (x1, y1), (x2, y2), box_color, 2)
        
        # 3. Add text label (violation type + confidence percentage)
        confidence_pct = int(violation.get('confidence', 0) * 100)
        label = f"{violation.get('violation_type', 'Violation')} {confidence_pct}%"
        
        # Font settings for label
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.6
        thickness = 1
        
        # Calculate size of the text to draw the background rectangle
        (text_width, text_height), baseline = cv2.getTextSize(label, font, font_scale, thickness)
        
        # Coordinates for the background rectangle (placed right above the bounding box)
        bg_x1 = x1
        bg_y1 = max(0, y1 - text_height - 10) # 10 pixels padding vertically
        bg_x2 = x1 + text_width + 10 # 10 pixels padding horizontally (5 per side)
        bg_y2 = y1
        
        # Draw the filled red background rectangle
        cv2.rectangle(image, (bg_x1, bg_y1), (bg_x2, bg_y2), box_color, -1)
        
        # Put the white text onto the background rectangle
        text_x = bg_x1 + 5
        text_y = bg_y2 - 5
        cv2.putText(image, label, (text_x, text_y), font, font_scale, text_color, thickness, cv2.LINE_AA)
        
    # Ensure output directory exists before saving
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    
    # 4. Save the annotated image to output_path
    cv2.imwrite(output_path, image)
    
    # 5. Return the output path
    return output_path
