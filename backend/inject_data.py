from sqlmodel import Session
from database import engine
from models.db_models import Violation

with Session(engine) as session:
    for i in range(3):
        v = Violation(
            vehicle_number="KA09D7625",
            violation_type="Triple Riding",
            confidence=0.89,
            image_url="https://example.com/test",
            evidence_image_path="/test",
            source_image_path="/test"
        )
        session.add(v)
    session.commit()
    print("Injected 3 violations for KA09D7625")
