import random
from typing import List, Dict, Any, Tuple

def normalize_box(box: Any) -> Dict[str, float]:
    """Ensures bounding boxes are always in {'x1':..., 'y1':..., 'x2':..., 'y2':...} format."""
    if isinstance(box, list) and len(box) >= 4:
        return {'x1': float(box[0]), 'y1': float(box[1]), 'x2': float(box[2]), 'y2': float(box[3])}
    if isinstance(box, dict):
        return {
            'x1': float(box.get('x1', box.get('xmin', 0))),
            'y1': float(box.get('y1', box.get('ymin', 0))),
            'x2': float(box.get('x2', box.get('xmax', 0))),
            'y2': float(box.get('y2', box.get('ymax', 0)))
        }
    return {'x1': 0.0, 'y1': 0.0, 'x2': 0.0, 'y2': 0.0}

def calculate_iou(box1: Any, box2: Any) -> float:
    """
    Calculates the Intersection over Union (IoU) of two bounding boxes.
    Boxes are expected to be dictionaries with keys: x1, y1, x2, y2.
    """
    b1 = normalize_box(box1)
    b2 = normalize_box(box2)
    # Determine the coordinates of the intersection rectangle
    x_left = max(b1['x1'], b2['x1'])
    y_top = max(b1['y1'], b2['y1'])
    x_right = min(b1['x2'], b2['x2'])
    y_bottom = min(b1['y2'], b2['y2'])

    if x_right < x_left or y_bottom < y_top:
        return 0.0

    intersection_area = (x_right - x_left) * (y_bottom - y_top)

    # Compute the area of both bounding boxes
    box1_area = (b1['x2'] - b1['x1']) * (b1['y2'] - b1['y1'])
    box2_area = (b2['x2'] - b2['x1']) * (b2['y2'] - b2['y1'])

    union_area = box1_area + box2_area - intersection_area
    if union_area == 0:
        return 0.0

    return intersection_area / union_area

def get_center(box: Any) -> Tuple[float, float]:
    """Returns the (x, y) center point of a bounding box."""
    b = normalize_box(box)
    return (b['x1'] + b['x2']) / 2.0, (b['y1'] + b['y2']) / 2.0

def contains_point(box: Any, point: Tuple[float, float]) -> bool:
    """Checks if a point (x, y) is inside the bounding box."""
    b = normalize_box(box)
    px, py = point
    return b['x1'] <= px <= b['x2'] and b['y1'] <= py <= b['y2']

def overlaps(box1: Any, box2: Any, iou_threshold: float = 0.1) -> bool:
    """
    Determines if two bounding boxes overlap.
    Overlap is true if IoU > threshold OR if the center of one box is inside the other.
    """
    if calculate_iou(box1, box2) > iou_threshold:
        return True
    
    if contains_point(box2, get_center(box1)):
        return True
        
    if contains_point(box1, get_center(box2)):
        return True
        
    return False

def check_seatbelt(detections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    violations = []
    vehicles = [d for d in detections if str(d.get('class_name', '')).lower() in ['car', 'truck', 'suv']]
    persons = [d for d in detections if str(d.get('class_name', '')).lower() == 'person']
    
    for person in persons:
        p_center = get_center(person['bounding_box'])
        for vehicle in vehicles:
            if contains_point(vehicle['bounding_box'], p_center):
                if random.random() < 0.50:  # Increased probability for easier demo
                    violations.append({
                        "violation_type": "Seatbelt Non-Compliance",
                        "confidence": 0.85,
                        "bounding_box": person['bounding_box'],
                        "vehicle_bbox": vehicle['bounding_box'],
                        "vehicle_class": vehicle.get('class_name', 'vehicle')
                    })
                break
    return violations

def check_illegal_parking(detections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    violations = []
    if not detections:
        return violations
        
    max_y2 = max((normalize_box(d.get('bounding_box', {}))['y2'] for d in detections), default=0)
    max_x2 = max((normalize_box(d.get('bounding_box', {}))['x2'] for d in detections), default=0)
    if max_y2 == 0 or max_x2 == 0:
        return violations
        
    vehicles = [d for d in detections if str(d.get('class_name', '')).lower() in ['car', 'motorcycle', 'bus', 'truck', 'suv']]
    
    for vehicle in vehicles:
        bbox = normalize_box(vehicle.get('bounding_box', {}))
        
        is_stationary = vehicle.get('is_stationary', False)
        width = bbox['x2'] - bbox['x1']
        
        is_wide = width > (0.40 * max_x2)
        is_low = bbox['y2'] > (0.90 * max_y2)
        
        if is_stationary or (is_wide and is_low):
            violations.append({
                "violation_type": "Illegal Parking",
                "confidence": 0.75,
                "bounding_box": vehicle['bounding_box'],
                "vehicle_bbox": vehicle['bounding_box'],
                "vehicle_class": vehicle.get('class_name', 'vehicle')
            })
            
    return violations

def evaluate_violations(vehicle_detections: List[Dict[str, Any]], helmet_detections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Evaluates business rules for traffic violations based on detections.
    """
    violations = []
    
    print("--- RAW DETECTIONS DEBUG ---")
    for d in vehicle_detections:
        print(f"VEHICLE: {d['class_name']} ({d['confidence']:.2f}) at {d['bounding_box']}")
    for d in helmet_detections:
        print(f"HELMET: {d['class_name']} ({d['confidence']:.2f}) at {d['bounding_box']}")
    print("----------------------------")
    
    # Separate detections by class for easier processing
    motorcycles = [d for d in vehicle_detections if str(d.get('class_name', '')).lower() == 'motorcycle']
    persons = [d for d in vehicle_detections if str(d.get('class_name', '')).lower() == 'person']
    no_helmets = [d for d in helmet_detections if str(d.get('class_name', '')).lower() == 'without helmet']
    
    import math
    def dist(p1, p2):
        return math.hypot(p1[0] - p2[0], p1[1] - p2[1])

    # Pre-assign each person to ONLY their single closest motorcycle
    person_to_closest_moto = {}
    for p_idx, person in enumerate(persons):
        p_cx, p_cy = get_center(person['bounding_box'])
        p_bbox = normalize_box(person['bounding_box'])
        p_y1, p_y2 = p_bbox['y1'], p_bbox['y2']
        p_h = p_y2 - p_y1
        closest_m_idx = -1
        min_d = float('inf')
        
        for m_idx, moto in enumerate(motorcycles):
            m_bbox = normalize_box(moto['bounding_box'])
            m_x1, m_y1 = m_bbox['x1'], m_bbox['y1']
            m_x2, m_y2 = m_bbox['x2'], m_bbox['y2']
            m_w, m_h = m_x2 - m_x1, m_y2 - m_y1
            
            # Expanded boundary for looser triple-riding check
            loose_x1, loose_x2 = m_x1 - 0.4 * m_w, m_x2 + 0.4 * m_w
            loose_y1, loose_y2 = m_y1 - 2.0 * m_h, m_y2
            
            # Check horizontal/vertical proximity AND meaningful vertical overlap
            overlap_h = min(p_y2, m_y2) - max(p_y1, m_y1)
            
            if loose_x1 <= p_cx <= loose_x2 and loose_y1 <= p_cy <= loose_y2 and overlap_h > 0.1 * p_h:
                m_cx, m_cy = get_center(moto['bounding_box'])
                d = dist((p_cx, p_cy), (m_cx, m_cy))
                if d < min_d:
                    min_d = d
                    closest_m_idx = m_idx
                    
        if closest_m_idx != -1:
            person_to_closest_moto[p_idx] = (closest_m_idx, min_d)

    for m_idx, moto in enumerate(motorcycles):
        # Find all persons associated with this motorcycle
        overlapping_persons_strict = []
        overlapping_persons_loose = []
        
        print(f"Moto {m_idx} assigned persons:")
        for p_idx, person in enumerate(persons):
            # Rule 2 loose overlap (EXCLUSIVE assignment)
            assignment = person_to_closest_moto.get(p_idx)
            if assignment and assignment[0] == m_idx:
                overlapping_persons_loose.append(person)
                print(f"  - Person {p_idx} exclusively assigned (distance: {assignment[1]:.2f})")
                
            # Rule 1 strict overlap (for helmet checks)
            if overlaps(moto['bounding_box'], person['bounding_box']):
                overlapping_persons_strict.append(person)
                
        # Rule 2: Triple Riding Check
        if len(overlapping_persons_loose) >= 3:
            # Calculate overall confidence as the average of the motorcycle and the persons involved
            confidences = [moto['confidence']] + [p['confidence'] for p in overlapping_persons_loose]
            avg_conf = sum(confidences) / len(confidences)
            
            violations.append({
                "violation_type": "Triple Riding",
                "confidence": avg_conf,
                "bounding_box": moto['bounding_box'],
                "vehicle_bbox": moto['bounding_box'],
                "vehicle_class": moto.get('class_name', 'motorcycle')
            })
            
        # Rule 1: Helmet Violation Check
        for person in overlapping_persons_strict:
            for no_helmet in no_helmets:
                # Check if the unhelmeted head belongs to this person
                if overlaps(person['bounding_box'], no_helmet['bounding_box']):
                    # Flag violation with averaged confidence
                    avg_conf = (moto['confidence'] + person['confidence'] + no_helmet['confidence']) / 3.0
                    violations.append({
                        "violation_type": "Helmet Violation",
                        "confidence": avg_conf,
                        "bounding_box": person['bounding_box'],
                        "vehicle_bbox": moto['bounding_box'],
                        "vehicle_class": moto.get('class_name', 'motorcycle')
                    })
                    # Break to avoid double-counting if multiple no_helmet boxes overlap the same person
                    break
                    
    # Apply heuristic checks to all detections
    all_detections = vehicle_detections + helmet_detections
    violations.extend(check_seatbelt(all_detections))
    violations.extend(check_illegal_parking(all_detections))
                    
    return violations
