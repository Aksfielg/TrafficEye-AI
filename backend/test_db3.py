from sqlmodel import Session, select, func
from database import engine
from models.db_models import Violation

with Session(engine) as session:
    results = session.exec(select(Violation.id, Violation.vehicle_number, Violation.violation_type)).all()
    for r in results:
        print(r)
    print("TOTAL:", len(results))
