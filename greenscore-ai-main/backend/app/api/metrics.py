from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from app.database.session import get_db
from app.models.entities import Zone, EnvironmentalMetric
from app.schemas.dtos import EnvironmentalMetricResponse
from app.services.external.openaq import openaq_client
from app.services.external.openmeteo import openmeteo_client

router = APIRouter(prefix="/metrics", tags=["Environmental Intelligence"])

@router.get("/latest", response_model=List[EnvironmentalMetricResponse])
def get_latest_metrics_all_zones(db: Session = Depends(get_db)):
    zones = db.query(Zone).all()
    metrics = []
    for z in zones:
        m = db.query(EnvironmentalMetric).filter(EnvironmentalMetric.zone_id == z.id).order_by(EnvironmentalMetric.timestamp.desc()).first()
        if m:
            metrics.append(m)
    return metrics

@router.get("/zone/{zone_id}", response_model=EnvironmentalMetricResponse)
def get_zone_latest_metric(zone_id: int, db: Session = Depends(get_db)):
    m = db.query(EnvironmentalMetric).filter(EnvironmentalMetric.zone_id == zone_id).order_by(EnvironmentalMetric.timestamp.desc()).first()
    if not m:
        raise HTTPException(status_code=404, detail="Metrics not found for zone")
    return m

@router.get("/live-sources")
async def get_live_external_sources():
    openaq_res = await openaq_client.fetch_latest_sensor_data()
    weather_res = await openmeteo_client.get_lucknow_weather()
    return {
        "air_quality": openaq_res,
        "weather": weather_res,
        "data_transparency": {
            "air_source": openaq_res.get("source"),
            "weather_source": weather_res.get("source"),
            "map_source": "Google Maps Platform & OpenStreetMap",
            "prediction_source": "GreenScore AI ML Model",
            "simulation_source": "GreenScore AI Scenario Engine"
        }
    }
