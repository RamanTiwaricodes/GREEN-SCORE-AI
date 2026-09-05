from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import datetime
from app.database.session import get_db
from app.models.entities import Zone, Problem, ActionAssignment, ImpactVerification, Department

router = APIRouter(prefix="/reports", tags=["Municipal Reports"])

@router.get("/sustainability-audit")
def generate_sustainability_audit_report(db: Session = Depends(get_db)):
    zones = db.query(Zone).all()
    problems = db.query(Problem).order_by(Problem.priority_rank.asc()).all()
    actions = db.query(ActionAssignment).all()
    impacts = db.query(ImpactVerification).all()
    departments = db.query(Department).all()

    avg_score = sum(z.current_green_score for z in zones) / max(1, len(zones))
    avg_aqi = sum(z.aqi for z in zones) / max(1, len(zones))
    avg_waste = sum(z.waste_efficiency for z in zones) / max(1, len(zones))
    
    total_budget_allocated = sum(d.budget_allocated for d in departments)
    total_budget_spent = sum(d.budget_spent for d in departments)

    return {
        "report_title": "MUNICIPAL SUSTAINABILITY AUDIT & IMPACT REPORT",
        "jurisdiction": "Lucknow Municipal Corporation (LMC)",
        "generated_at": datetime.datetime.utcnow().isoformat(),
        "report_id": f"REP-LKO-{datetime.datetime.utcnow().strftime('%Y%m%d')}-01",
        "executive_summary": {
            "city_green_score": round(avg_score, 1),
            "tier": "Good" if avg_score >= 60 else "Moderate",
            "air_quality_index": round(avg_aqi, 1),
            "waste_collection_efficiency": f"{round(avg_waste, 1)}%",
            "total_monitored_zones": len(zones),
            "critical_risk_zones": [z.name for z in zones if z.risk_level in ["Critical", "High"]],
            "total_budget_allocated": total_budget_allocated,
            "total_budget_spent": total_budget_spent
        },
        "zone_breakdown": [
            {
                "zone_name": z.name,
                "population": z.population,
                "green_score": z.current_green_score,
                "predicted_score_30d": z.predicted_green_score,
                "risk_level": z.risk_level,
                "aqi": z.aqi,
                "waste_efficiency": f"{z.waste_efficiency}%",
                "open_issues": z.open_issues_count
            }
            for z in zones
        ],
        "top_priorities": [
            {
                "rank": p.priority_rank,
                "title": p.title,
                "zone_id": p.zone_id,
                "severity": p.severity,
                "affected_population": p.affected_population,
                "priority_score": p.priority_score,
                "reason": p.why_priority_reason
            }
            for p in problems[:5]
        ],
        "department_scorecard": [
            {
                "department": d.name,
                "active_projects": d.active_projects_count,
                "budget_allocated": d.budget_allocated,
                "budget_spent": d.budget_spent,
                "utilization_pct": round((d.budget_spent / max(1.0, d.budget_allocated)) * 100, 1)
            }
            for d in departments
        ],
        "verified_impact_summary": [
            {
                "action_id": v.action_id,
                "metric": v.metric_name,
                "pre_val": v.pre_metric_val,
                "post_val": v.post_metric_val,
                "predicted_delta": v.predicted_delta,
                "measured_delta": v.measured_delta,
                "attainment_pct": f"{v.goal_attainment_pct}%",
                "verdict": v.verdict
            }
            for v in impacts
        ]
    }
