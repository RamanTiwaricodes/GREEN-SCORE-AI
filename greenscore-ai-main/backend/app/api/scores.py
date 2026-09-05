from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.session import get_db
from app.models.entities import Zone, EnvironmentalMetric, SustainabilityScore, SystemSetting
from app.schemas.dtos import ScoreWeightConfig, SustainabilityScoreResponse
from app.services.scoring.green_score import calculate_green_score, DEFAULT_WEIGHTS
import json

router = APIRouter(prefix="/scores", tags=["Sustainability Scores"])

@router.get("/city-summary")
def get_city_score_summary(db: Session = Depends(get_db)):
    zones = db.query(Zone).all()
    if not zones:
        return {"overall_score": 72.0, "tier": "Good", "zone_count": 0}
        
    avg_score = sum(z.current_green_score for z in zones) / len(zones)
    avg_aqi = sum(z.aqi for z in zones) / len(zones)
    avg_waste = sum(z.waste_efficiency for z in zones) / len(zones)
    avg_water = sum(z.water_score for z in zones) / len(zones)
    avg_green = sum(z.green_cover_pct for z in zones) / len(zones)
    avg_energy = sum(z.energy_score for z in zones) / len(zones)
    avg_mobility = sum(z.mobility_score for z in zones) / len(zones)
    
    tier = "Excellent" if avg_score >= 80 else ("Good" if avg_score >= 60 else ("Moderate" if avg_score >= 40 else "Poor"))
    
    return {
        "city": "Lucknow",
        "overall_score": round(avg_score, 1),
        "tier": tier,
        "delta_month": +4.8,
        "risk_trend": "Improving",
        "subscores": {
            "air": round(avg_aqi, 1),
            "waste": round(avg_waste, 1),
            "water": round(avg_water, 1),
            "green_cover": round(avg_green, 1),
            "energy": round(avg_energy, 1),
            "mobility": round(avg_mobility, 1)
        },
        "zones_count": len(zones),
        "source": "GreenScore AI Multi-Domain Engine"
    }

@router.get("/weights")
def get_current_weights(db: Session = Depends(get_db)):
    setting = db.query(SystemSetting).filter(SystemSetting.setting_key == "SCORE_WEIGHTS").first()
    if setting:
        return json.loads(setting.setting_value)
    return DEFAULT_WEIGHTS

@router.post("/recalculate")
def recalculate_scores(weights: ScoreWeightConfig, db: Session = Depends(get_db)):
    w_dict = weights.model_dump()
    # Save weights to DB
    setting = db.query(SystemSetting).filter(SystemSetting.setting_key == "SCORE_WEIGHTS").first()
    if setting:
        setting.setting_value = json.dumps(w_dict)
    else:
        setting = SystemSetting(setting_key="SCORE_WEIGHTS", setting_value=json.dumps(w_dict), description="Configurable Green Score Category Weights")
        db.add(setting)
        
    zones = db.query(Zone).all()
    results = []
    for z in zones:
        metric = db.query(EnvironmentalMetric).filter(EnvironmentalMetric.zone_id == z.id).order_by(EnvironmentalMetric.timestamp.desc()).first()
        m_dict = {
            "aqi": metric.aqi if metric else z.aqi,
            "pm25": metric.pm25 if metric else 45.0,
            "waste_collection_pct": metric.waste_collection_pct if metric else z.waste_efficiency,
            "recycling_rate_pct": metric.recycling_rate_pct if metric else 20.0,
            "open_dumping_reports": metric.open_dumping_reports if metric else 2,
            "water_quality_index": metric.water_quality_index if metric else z.water_score,
            "water_stress_level": metric.water_stress_level if metric else "Moderate",
            "green_cover_pct": metric.green_cover_pct if metric else z.green_cover_pct,
            "renewable_energy_pct": metric.renewable_energy_pct if metric else 18.0,
            "energy_demand_mwh": metric.energy_demand_mwh if metric else 300.0,
            "traffic_intensity_idx": metric.traffic_intensity_idx if metric else 60.0,
            "ev_adoption_pct": metric.ev_adoption_pct if metric else 8.0
        }
        res = calculate_green_score(m_dict, w_dict, open_issues=z.open_issues_count, population=z.population)
        z.current_green_score = res["score"]
        results.append({
            "zone_id": z.id,
            "zone_name": z.name,
            "new_score": res["score"],
            "tier": res["tier"],
            "subscores": res["subscores"]
        })
        
    db.commit()
    return {
        "message": "Weights updated and Green Scores recalculated across all zones successfully",
        "weights": w_dict,
        "recalculated_zones": results
    }
