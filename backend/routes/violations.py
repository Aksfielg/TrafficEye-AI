from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select
from typing import List

from database import get_session
from models.db_models import Violation

router = APIRouter()

@router.get("/")
def get_violations(
    offset: int = 0,
    limit: int = Query(default=100, le=100),
    session: Session = Depends(get_session)
):
    """
    Retrieve all violations, newest first, with pagination.
    """
    # Order by timestamp descending (newest first)
    statement = select(Violation).order_by(Violation.timestamp.desc()).offset(offset).limit(limit)
    results = session.exec(statement).all()
    return results

@router.get("/{vehicle_number}")
def get_violations_by_vehicle(
    vehicle_number: str,
    session: Session = Depends(get_session)
):
    """
    Retrieve all violations for a specific vehicle number.
    Used for the 'Repeat Offenders' feature.
    """
    # Filter by vehicle number and order newest first
    statement = select(Violation).where(Violation.vehicle_number == vehicle_number).order_by(Violation.timestamp.desc())
    results = session.exec(statement).all()
    return results
