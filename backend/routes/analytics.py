import os
import google.generativeai as genai
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from sqlalchemy import func
from collections import Counter
from datetime import datetime
from typing import Dict, Any

from database import get_session
from models.db_models import Violation

router = APIRouter()

@router.get("/")
def get_analytics(session: Session = Depends(get_session)) -> Dict[str, Any]:
    """
    Returns aggregated analytics data for the dashboard.
    """
    # Fetch timestamps early so we can use them for today's count and hourly stats
    timestamps = session.exec(select(Violation.timestamp)).all()

    # 1. Total violations count
    total_violations = len(timestamps)
    
    # 1b. Today's count
    today = datetime.utcnow().date()
    today_count = sum(1 for ts in timestamps if ts and ts.date() == today)
    
    # 2. Violations by type (for a pie chart)
    type_counts = session.exec(
        select(Violation.violation_type, func.count(Violation.id))
        .group_by(Violation.violation_type)
    ).all()
    violations_by_type = {v_type: count for v_type, count in type_counts}
    
    # 3. Violations by hour (for a bar chart)
    # Reusing the timestamps fetched above
    hour_counts = Counter(ts.hour for ts in timestamps if ts)
    # Pre-fill all 24 hours with 0 to ensure continuous chart data
    violations_by_hour = {str(hour): hour_counts.get(hour, 0) for hour in range(24)}
    
    # 4. Top repeat offenders
    # Top 5 vehicle numbers with >= 2 violations
    repeat_offenders_query = (
        select(Violation.vehicle_number, func.count(Violation.id), func.max(Violation.vehicle_type))
        .where(Violation.vehicle_number.is_not(None))
        .where(Violation.vehicle_number != "")
        .where(Violation.vehicle_number != "UNREADABLE")
        .where(~Violation.vehicle_number.contains("No Plate Detected"))
        .group_by(Violation.vehicle_number)
        .having(func.count(Violation.id) >= 2)
        .order_by(func.count(Violation.id).desc())
        .limit(5)
    )
    repeat_offenders_results = session.exec(repeat_offenders_query).all()
    
    top_repeat_offenders = [
        {"vehicle_number": v_num, "count": count, "vehicle_type": v_type}
        for v_num, count, v_type in repeat_offenders_results
    ]
    # 5. Violations by location
    location_counts_analytics = session.exec(
        select(Violation.location, func.count(Violation.id))
        .group_by(Violation.location)
    ).all()
    violations_by_location = {loc: count for loc, count in location_counts_analytics}
    
    return {
        "total_violations": total_violations,
        "today_count": today_count,
        "violations_by_type": violations_by_type,
        "violations_by_hour": violations_by_hour,
        "violations_by_location": violations_by_location,
        "top_repeat_offenders": top_repeat_offenders
    }

@router.get("/insights")
def get_insights(session: Session = Depends(get_session)) -> Dict[str, str]:
    """
    Calls the Gemini API to generate an actionable insight based on the current analytics.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"insights": "AI Insights are currently offline. Please configure GEMINI_API_KEY to receive automated enforcement recommendations."}

    # Fetch basic analytics data
    timestamps = session.exec(select(Violation.timestamp)).all()
    type_counts = session.exec(
        select(Violation.violation_type, func.count(Violation.id))
        .group_by(Violation.violation_type)
    ).all()
    
    violations_by_type = {v_type: count for v_type, count in type_counts}
    hour_counts = Counter(ts.hour for ts in timestamps if ts)
    violations_by_hour = {str(hour): hour_counts.get(hour, 0) for hour in range(24)}
    
    location_counts = session.exec(
        select(Violation.location, func.count(Violation.id))
        .group_by(Violation.location)
    ).all()
    violations_by_location = {loc: count for loc, count in location_counts}

    if not timestamps:
         return {"insights": "Insufficient data to generate AI insights. Complete more scans to build a baseline."}

    prompt = f"""
    Act as a Traffic Police Strategic AI. Analyze the locations and hours, and output a 2-sentence 'Predictive Deployment Strategy'. Specifically state WHICH location has the highest probability of future violations and at WHAT hour patrol units should be deployed there to intercept them.
    
    Here is the recent violation data:
    Violations by Hour (0-23): {violations_by_hour}
    Violations by Location: {violations_by_location}
    
    Do not use markdown formatting like bolding or bullet points, just write a plain text paragraph.
    """

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        return {"insights": response.text.strip()}
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {"insights": "AI engine temporarily unavailable. Could not generate automated insights at this time."}

