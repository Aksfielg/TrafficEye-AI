from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class Violation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    vehicle_number: Optional[str] = Field(default=None)
    vehicle_type: Optional[str] = Field(default=None)
    violation_type: str
    confidence: float
    location: str = Field(default="Unknown")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    image_url: str
    evidence_image_path: str
    source_image_path: str
