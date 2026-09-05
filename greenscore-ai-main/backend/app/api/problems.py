from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from app.database.session import get_db
from app.models.entities import Problem, Zone, Department
from app.schemas.dtos import ProblemResponse, PrioritizeRequest
from app.services.priority.priority_engine import priority_engine

router = APIRouter(prefix="/problems", tags=["AI Problems & Priority Engine"])

@router.get("", response_model=List[ProblemResponse])
def get_all_problems(zone_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Problem)
    if zone_id:
        query = query.filter(Problem.zone_id == zone_id)
    problems = query.order_by(Problem.priority_rank.asc()).all()
    
    # Populate zone and department names
    resp = []
    for p in problems:
        z = db.query(Zone).filter(Zone.id == p.zone_id).first()
        d = db.query(Department).filter(Department.id == p.suggested_department_id).first() if p.suggested_department_id else None
        
        dto = ProblemResponse(
            id=p.id,
            zone_id=p.zone_id,
            zone_name=z.name if z else "Unknown Zone",
            title=p.title,
            category=p.category,
            severity=p.severity,
            affected_population=p.affected_population,
            current_metric_val=p.current_metric_val,
            trend=p.trend,
            predicted_deterioration=p.predicted_deterioration,
            priority_score=p.priority_score,
            priority_rank=p.priority_rank,
            confidence_pct=p.confidence_pct,
            suggested_department_id=p.suggested_department_id,
            suggested_department_name=d.name if d else "Unassigned",
            why_priority_reason=p.why_priority_reason,
            status=p.status,
            created_at=p.created_at
        )
        resp.append(dto)
    return resp

@router.post("/prioritize")
def run_prioritization_engine(req: PrioritizeRequest, db: Session = Depends(get_db)):
    query = db.query(Problem)
    if req.zone_id:
        query = query.filter(Problem.zone_id == req.zone_id)
    problems = query.all()
    
    prob_dicts = []
    for p in problems:
        z = db.query(Zone).filter(Zone.id == p.zone_id).first()
        d = db.query(Department).filter(Department.id == p.suggested_department_id).first() if p.suggested_department_id else None
        prob_dicts.append({
            "id": p.id,
            "zone_id": p.zone_id,
            "zone_name": z.name if z else "Unknown",
            "title": p.title,
            "category": p.category,
            "severity": p.severity,
            "affected_population": p.affected_population,
            "current_metric_val": p.current_metric_val,
            "trend": p.trend,
            "predicted_deterioration": p.predicted_deterioration,
            "suggested_department_id": p.suggested_department_id,
            "suggested_department_name": d.name if d else "Unassigned",
            "status": p.status
        })
        
    ranked = priority_engine.rank_problems(prob_dicts)
    
    # Update ranks in database
    for r in ranked:
        db_p = db.query(Problem).filter(Problem.id == r["id"]).first()
        if db_p:
            db_p.priority_rank = r["priority_rank"]
            db_p.priority_score = r["priority_score"]
            db_p.why_priority_reason = r["why_priority_reason"]
            
    db.commit()
    return {
        "message": f"Successfully prioritized {len(ranked)} urban problems using Multi-Criteria Decision Analysis",
        "ranked_problems": ranked
    }
