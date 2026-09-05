from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from app.database.session import get_db
from app.models.entities import Recommendation, Problem, Zone, Department
from app.schemas.dtos import RecommendationResponse

router = APIRouter(prefix="/recommendations", tags=["AI Recommendations"])

@router.get("", response_model=List[RecommendationResponse])
def get_all_recommendations(
    problem_id: Optional[int] = None,
    zone_id: Optional[int] = None,
    department_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Recommendation)
    if problem_id:
        query = query.filter(Recommendation.problem_id == problem_id)
    if zone_id:
        query = query.filter(Recommendation.zone_id == zone_id)
    if department_id:
        query = query.filter(Recommendation.department_id == department_id)
        
    recs = query.all()
    resp = []
    for r in recs:
        z = db.query(Zone).filter(Zone.id == r.zone_id).first()
        d = db.query(Department).filter(Department.id == r.department_id).first()
        dto = RecommendationResponse(
            id=r.id,
            problem_id=r.problem_id,
            zone_id=r.zone_id,
            zone_name=z.name if z else "Unknown Zone",
            title=r.title,
            description=r.description,
            estimated_cost=r.estimated_cost,
            expected_score_gain=r.expected_score_gain,
            expected_env_gain=r.expected_env_gain,
            implementation_days=r.implementation_days,
            population_benefited=r.population_benefited,
            feasibility_pct=r.feasibility_pct,
            department_id=r.department_id,
            department_name=d.name if d else "Unassigned",
            explainable_reason=r.explainable_reason,
            status=r.status
        )
        resp.append(dto)
    return resp

@router.post("/{recommendation_id}/approve")
def approve_recommendation(recommendation_id: int, db: Session = Depends(get_db)):
    rec = db.query(Recommendation).filter(Recommendation.id == recommendation_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    rec.status = "APPROVED"
    db.commit()
    return {"message": f"Recommendation '{rec.title}' approved successfully", "id": rec.id, "status": rec.status}
