from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.entities import Zone, Problem, EnvironmentalMetric, ActionAssignment
from app.schemas.dtos import AssistantChatRequest, AssistantChatResponse
from app.services.ai.assistant import ai_assistant

router = APIRouter(prefix="/assistant", tags=["AI Municipal Assistant"])

@router.post("/chat", response_model=AssistantChatResponse)
async def chat_with_assistant(req: AssistantChatRequest, db: Session = Depends(get_db)):
    zones = db.query(Zone).all()
    problems = db.query(Problem).filter(Problem.status == "OPEN").all()
    actions = db.query(ActionAssignment).all()
    
    avg_score = sum(z.current_green_score for z in zones) / max(1, len(zones))
    avg_aqi = sum(z.aqi for z in zones) / max(1, len(zones))
    avg_waste = sum(z.waste_efficiency for z in zones) / max(1, len(zones))
    
    city_context = {
        "city": "Lucknow",
        "overall_score": round(avg_score, 1),
        "avg_aqi": round(avg_aqi, 1),
        "waste_eff": round(avg_waste, 1),
        "open_issues": len(problems),
        "active_projects": len(actions),
        "zones": [{"name": z.name, "score": z.current_green_score, "aqi": z.aqi, "risk": z.risk_level} for z in zones]
    }
    
    response = await ai_assistant.generate_response(
        query=req.query,
        city_context=city_context,
        context_mode=req.context_mode or "ADMIN"
    )
    
    return response
