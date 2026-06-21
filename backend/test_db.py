from sqlmodel import create_engine, Session, select, func
from models.db_models import Violation

engine = create_engine("sqlite:///traffic_eye.db")
with Session(engine) as session:
    results = session.exec(
        select(Violation.vehicle_number, func.count(Violation.id))
        .where(Violation.vehicle_number.is_not(None))
        .where(Violation.vehicle_number != "")
        .where(Violation.vehicle_number != "UNREADABLE")
        .group_by(Violation.vehicle_number)
        .having(func.count(Violation.id) >= 2)
        .order_by(func.count(Violation.id).desc())
        .limit(5)
    ).all()
    print("REPEAT OFFENDERS:", results)
