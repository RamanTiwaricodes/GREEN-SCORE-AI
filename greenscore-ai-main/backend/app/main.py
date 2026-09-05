import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager

from app.core.config import settings
from app.database.session import engine, Base, get_db
from app.seed_data import seed_database
from app.models.entities import Zone, Problem, ActionAssignment, ImpactVerification, Alert, Department

# Routers
from app.api.auth import router as auth_router
from app.api.zones import router as zones_router
from app.api.scores import router as scores_router
from app.api.metrics import router as metrics_router
from app.api.predictions import router as predictions_router
from app.api.problems import router as problems_router
from app.api.recommendations import router as recommendations_router
from app.api.budget import router as budget_router
from app.api.simulation import router as simulation_router
from app.api.citizen_reports import router as citizen_reports_router
from app.api.actions import router as actions_router
from app.api.impact import router as impact_router
from app.api.assistant import router as assistant_router
from app.api.alerts import router as alerts_router
from app.api.departments import router as departments_router
from app.api.audit import router as audit_router
from app.api.reports import router as reports_router
from app.api.settings import router as settings_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables & seed data if needed
    Base.metadata.create_all(bind=engine)
    try:
        seed_database()
    except Exception as e:
        print(f"Seed error or already seeded: {e}")
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Municipal Sustainability, Action & Impact Optimization System (Predict. Prioritize. Optimize. Act. Measure.)",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(zones_router, prefix=settings.API_V1_STR)
app.include_router(scores_router, prefix=settings.API_V1_STR)
app.include_router(metrics_router, prefix=settings.API_V1_STR)
app.include_router(predictions_router, prefix=settings.API_V1_STR)
app.include_router(problems_router, prefix=settings.API_V1_STR)
app.include_router(recommendations_router, prefix=settings.API_V1_STR)
app.include_router(budget_router, prefix=settings.API_V1_STR)
app.include_router(simulation_router, prefix=settings.API_V1_STR)
app.include_router(citizen_reports_router, prefix=settings.API_V1_STR)
app.include_router(actions_router, prefix=settings.API_V1_STR)
app.include_router(impact_router, prefix=settings.API_V1_STR)
app.include_router(assistant_router, prefix=settings.API_V1_STR)
app.include_router(alerts_router, prefix=settings.API_V1_STR)
app.include_router(departments_router, prefix=settings.API_V1_STR)
app.include_router(audit_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)
app.include_router(settings_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "system": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "team": "Orbit",
        "status": "ONLINE",
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

@app.get("/api/dashboard")
def get_dashboard_summary(db: Session = Depends(get_db)):
    zones = db.query(Zone).all()
    problems = db.query(Problem).filter(Problem.status == "OPEN").order_by(Problem.priority_rank.asc()).all()
    actions = db.query(ActionAssignment).all()
    impacts = db.query(ImpactVerification).all()
    alerts = db.query(Alert).filter(Alert.is_active == True).all()
    departments = db.query(Department).all()

    avg_score = sum(z.current_green_score for z in zones) / max(1, len(zones))
    avg_aqi = sum(z.aqi for z in zones) / max(1, len(zones))
    avg_waste = sum(z.waste_efficiency for z in zones) / max(1, len(zones))
    avg_water = sum(z.water_score for z in zones) / max(1, len(zones))
    avg_green = sum(z.green_cover_pct for z in zones) / max(1, len(zones))
    avg_energy = sum(z.energy_score for z in zones) / max(1, len(zones))
    avg_mobility = sum(z.mobility_score for z in zones) / max(1, len(zones))

    return {
        "city": "Lucknow",
        "jurisdiction": "Lucknow Municipal Corporation",
        "kpis": {
            "overall_green_score": round(avg_score, 1),
            "score_delta_pct": +4.8,
            "tier": "Good",
            "aqi": round(avg_aqi, 1),
            "aqi_category": "Moderate",
            "waste_efficiency": round(avg_waste, 1),
            "water_health": round(avg_water, 1),
            "green_cover_pct": round(avg_green, 1),
            "energy_efficiency": round(avg_energy, 1),
            "mobility_score": round(avg_mobility, 1),
            "open_issues_count": len(problems),
            "active_projects_count": len([a for a in actions if a.status in ["In Progress", "Assigned"]]),
            "verified_impacts_count": len(impacts)
        },
        "zones": zones,
        "top_problems": problems[:4],
        "active_actions": actions[:4],
        "recent_impacts": impacts[:3],
        "active_alerts": alerts[:4],
        "departments": departments,
        "workflow_pipeline_status": {
            "monitored_nodes": 48,
            "predictions_active": len(zones),
            "priority_ranked": len(problems),
            "optimized_scenarios": 3,
            "actions_in_flight": len(actions),
            "verified_outcomes": len(impacts)
        }
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
