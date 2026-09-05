from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.session import get_db
from app.models.entities import Zone, EnvironmentalMetric, SustainabilityScore, Problem, ActionAssignment
from app.schemas.dtos import ZoneResponse

router = APIRouter(prefix="/zones", tags=["Zones"])

@router.get("", response_model=List[ZoneResponse])
def get_all_zones(db: Session = Depends(get_db)):
    zones = db.query(Zone).all()
    return zones

@router.get("/{zone_id}")
def get_zone_details(zone_id: int, db: Session = Depends(get_db)):
    zone = db.query(Zone).filter(Zone.id == zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
        
    latest_metric = (
        db.query(EnvironmentalMetric)
        .filter(EnvironmentalMetric.zone_id == zone_id)
        .order_by(EnvironmentalMetric.timestamp.desc())
        .first()
    )
    latest_score = (
        db.query(SustainabilityScore)
        .filter(SustainabilityScore.zone_id == zone_id)
        .order_by(SustainabilityScore.calculated_at.desc())
        .first()
    )
    active_problems = db.query(Problem).filter(Problem.zone_id == zone_id, Problem.status == "OPEN").all()
    active_actions = db.query(ActionAssignment).filter(ActionAssignment.zone_id == zone_id).all()

    return {
        "zone": zone,
        "latest_metric": latest_metric,
        "latest_score": latest_score,
        "active_problems_count": len(active_problems),
        "problems": active_problems,
        "active_actions_count": len(active_actions),
        "actions": active_actions
    }
