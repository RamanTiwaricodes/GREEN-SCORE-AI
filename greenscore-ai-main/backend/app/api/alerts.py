from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.entities import Alert, Zone
from app.schemas.dtos import AlertResponse

router = APIRouter(prefix="/alerts", tags=["Alerts & Early Warning System"])

@router.get("", response_model=List[AlertResponse])
def get_active_alerts(db: Session = Depends(get_db)):
    alerts = db.query(Alert).filter(Alert.is_active == True).order_by(Alert.created_at.desc()).all()
    resp = []
    for a in alerts:
        z = db.query(Zone).filter(Zone.id == a.zone_id).first() if a.zone_id else None
        resp.append(AlertResponse(
            id=a.id,
            zone_id=a.zone_id,
            zone_name=z.name if z else "City-Wide",
            title=a.title,
            message=a.message,
            category=a.category,
            severity=a.severity,
            trigger_metric=a.trigger_metric,
            is_active=a.is_active,
            created_at=a.created_at
        ))
    return resp

@router.post("/{alert_id}/dismiss")
def dismiss_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert:
        alert.is_active = False
        db.commit()
    return {"message": "Alert dismissed", "alert_id": alert_id}
