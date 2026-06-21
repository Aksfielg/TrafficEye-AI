import os
import shutil
import uuid
import time
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlmodel import Session

from database import get_session
from models.db_models import Violation
from services.detector import detect_objects, detect_helmets
from services.rules import evaluate_violations
from services.ocr import read_plate
from services.evidence import generate_evidence_image
from services.storage import upload_evidence_image

router = APIRouter()

# Define absolute paths for file storage
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
EVIDENCE_DIR = os.path.join(BASE_DIR, "evidence")

# Ensure directories exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(EVIDENCE_DIR, exist_ok=True)

@router.post("/")
async def analyze_image(file: UploadFile = File(...), session: Session = Depends(get_session)):
    """
    Analyzes an uploaded image for traffic violations.
    """
    # 1. Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

    # 2. Save uploaded file locally
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1] or ".jpg"
    original_filename = f"{file_id}_source{ext}"
    source_path = os.path.join(UPLOAD_DIR, original_filename)
    
    try:
        t0 = time.time()
        with open(source_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        t1 = time.time()
        # 3. Run YOLO detection
        vehicle_detections = detect_objects(source_path)
        helmet_detections = detect_helmets(source_path)
        t2 = time.time()
        print(f"[TIMING] YOLO Detection: {t2 - t1:.2f}s")
        
        # 4. Evaluate rules
        violations = evaluate_violations(vehicle_detections, helmet_detections)
        t3 = time.time()
        
        # 5. Extract License Plates
        processed_violations = []
        for v in violations:
            vehicle_bbox = v['vehicle_bbox']
            plate_text = read_plate(source_path, vehicle_bbox)
            v['vehicle_number'] = plate_text
            processed_violations.append(v)
            
        evidence_filename = f"{file_id}_evidence.jpg"
        evidence_path = os.path.join(EVIDENCE_DIR, evidence_filename)
        
        # 6. Draw boxes on evidence image
        generate_evidence_image(source_path, processed_violations, evidence_path)
        
        t4 = time.time()
        print(f"[TIMING] Evidence Annotation: {t4 - t3:.2f}s")
        print(f"[TIMING] Total Pipeline: {t4 - t0:.2f}s")
        
        # Upload evidence image to Supabase Storage
        evidence_url = upload_evidence_image(evidence_path, evidence_filename)
        
        # 7. Save violations to the database via SQLModel session
        for v in processed_violations:
            db_violation = Violation(
                vehicle_number=v.get('vehicle_number'),
                violation_type=v['violation_type'],
                confidence=v['confidence'],
                image_url=evidence_url,
                evidence_image_path=evidence_path,
                source_image_path=source_path
            )
            session.add(db_violation)
            
        # Commit the transaction to store rows
        session.commit()
        
        # Prepare the clean JSON response payload
        response_data = []
        for v in processed_violations:
            response_data.append({
                "type": v['violation_type'],
                "confidence": v['confidence'],
                "vehicle_number": v['vehicle_number']
            })
            
        # 8. Return JSON
        return {
            "violations": response_data,
            "evidence_image_path": evidence_url
        }

    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        print("--- /analyze ENDPOINT CRASH ---")
        print(tb)
        # 9. Handle errors gracefully (clean error for frontend)
        raise HTTPException(status_code=500, detail={"error": str(e), "traceback": tb})
