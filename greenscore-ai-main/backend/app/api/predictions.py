from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from app.database.session import get_db
from app.models.entities import Zone, Prediction
from app.services.prediction.forecast_engine import forecast_engine
import json

router = APIRouter(prefix="/predictions", tags=["AI Predictions"])

@router.get("/forecast")
def get_prediction_forecast(
    zone_id: int = Query(..., description="Target Zone ID"),
    target_metric: str = Query("GREEN_SCORE", description="Metric: GREEN_SCORE, AQI, WASTE_EFFICIENCY, WATER_SCORE, ENERGY"),
    timeframe_days: int = Query(30, description="7 or 30 days"),
    db: Session = Depends(get_db)
):
    zone = db.query(Zone).filter(Zone.id == zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
        
    metric_val_map = {
        "GREEN_SCORE": zone.current_green_score,
        "AQI": zone.aqi,
        "WASTE_EFFICIENCY": zone.waste_efficiency,
        "WATER_SCORE": zone.water_score,
        "ENERGY": zone.energy_score
    }
    
    curr_val = metric_val_map.get(target_metric, zone.current_green_score)
    trend = "DETERIORATING" if zone.risk_level in ["Critical", "High"] else "IMPROVING"
    
    result = forecast_engine.predict_trajectory(
        target_metric=target_metric,
        current_val=curr_val,
        timeframe_days=timeframe_days,
        historical_trend=trend
    )
    
    result["zone_id"] = zone.id
    result["zone_name"] = zone.name
    return result

@router.get("/all-zones-summary")
def get_all_zones_predictions_summary(db: Session = Depends(get_db)):
    zones = db.query(Zone).all()
    summaries = []
    for z in zones:
        trend = "DETERIORATING" if z.risk_level in ["Critical", "High"] else "STABLE"
        pred = forecast_engine.predict_trajectory("GREEN_SCORE", z.current_green_score, 30, historical_trend=trend)
        summaries.append({
            "zone_id": z.id,
            "zone_name": z.name,
            "current_score": z.current_green_score,
            "forecast_30d_score": pred["predicted_val"],
            "risk_level": pred["risk_level"],
            "confidence_pct": pred["confidence_pct"],
            "key_risk_reason": pred["risk_factors"][0] if pred["risk_factors"] else "Stable urban trajectory."
        })
    return summaries
