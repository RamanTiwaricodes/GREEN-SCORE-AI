from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.session import get_db
from app.models.entities import Recommendation, Problem, Zone, Department, BudgetScenario, AuditLog
from app.schemas.dtos import BudgetOptimizeRequest, BudgetOptimizationResponse
from app.services.budget.budget_optimizer import budget_optimizer
import json

router = APIRouter(prefix="/budget", tags=["Smart Budget Optimizer"])

@router.post("/optimize", response_model=BudgetOptimizationResponse)
def optimize_budget_portfolio(req: BudgetOptimizeRequest, db: Session = Depends(get_db)):
    # Fetch all candidate recommendations
    recs = db.query(Recommendation).filter(Recommendation.status != "REJECTED").all()
    
    candidates = []
    for r in recs:
        z = db.query(Zone).filter(Zone.id == r.zone_id).first()
        d = db.query(Department).filter(Department.id == r.department_id).first()
        p = db.query(Problem).filter(Problem.id == r.problem_id).first()
        
        candidates.append({
            "id": r.id,
            "title": r.title,
            "category": p.category if p else "Environmental Management",
            "zone_name": z.name if z else "Lucknow Central",
            "department_name": d.name if d else "Municipal Sanitation",
            "estimated_cost": r.estimated_cost,
            "expected_score_gain": r.expected_score_gain,
            "population_benefited": r.population_benefited,
            "implementation_days": r.implementation_days,
            "feasibility_pct": r.feasibility_pct
        })
        
    result = budget_optimizer.optimize_allocation(
        available_budget=req.available_budget,
        candidate_recommendations=candidates,
        risk_appetite=req.risk_appetite or "BALANCED"
    )
    
    # Save budget scenario run to DB
    scenario = BudgetScenario(
        name=f"Portfolio for ₹{int(req.available_budget):,} ({req.risk_appetite})",
        available_budget=req.available_budget,
        allocated_budget=result["total_allocated"],
        selected_interventions_json=json.dumps(result["allocations"]),
        expected_total_score_gain=result["expected_total_score_gain"],
        total_population_benefited=result["total_population_benefited"],
        reasoning=result["explainable_summary"],
        created_by="Municipal Authority"
    )
    db.add(scenario)
    
    # Add audit log
    audit = AuditLog(
        user_name="Municipal Authority",
        role="SUPER_ADMIN",
        action_type="OPTIMIZE_BUDGET",
        entity_type="BUDGET_SCENARIO",
        details_json=json.dumps({"budget": req.available_budget, "allocated": result["total_allocated"]})
    )
    db.add(audit)
    db.commit()
    
    return result

@router.get("/saved-scenarios")
def get_saved_budget_scenarios(db: Session = Depends(get_db)):
    scenarios = db.query(BudgetScenario).order_by(BudgetScenario.created_at.desc()).limit(10).all()
    resp = []
    for s in scenarios:
        resp.append({
            "id": s.id,
            "name": s.name,
            "available_budget": s.available_budget,
            "allocated_budget": s.allocated_budget,
            "expected_total_score_gain": s.expected_total_score_gain,
            "total_population_benefited": s.total_population_benefited,
            "reasoning": s.reasoning,
            "created_at": s.created_at,
            "allocations_count": len(json.loads(s.selected_interventions_json)) if s.selected_interventions_json else 0
        })
    return resp
