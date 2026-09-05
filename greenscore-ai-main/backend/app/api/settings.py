from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.database.session import get_db
from app.models.entities import SystemSetting
from app.core.config import settings

router = APIRouter(prefix="/settings", tags=["System Settings"])

@router.get("")
def get_system_settings(db: Session = Depends(get_db)):
    db_settings = db.query(SystemSetting).all()
    res = {s.setting_key: s.setting_value for s in db_settings}
    return {
        "project_name": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "version": settings.VERSION,
        "configured_api_keys": {
            "google_maps": bool(settings.GOOGLE_MAPS_API_KEY),
            "openaq": bool(settings.OPENAQ_API_KEY),
            "llm": bool(settings.LLM_API_KEY),
            "vision": bool(settings.VISION_API_KEY)
        },
        "database_url": settings.DATABASE_URL.split("@")[-1] if "@" in settings.DATABASE_URL else settings.DATABASE_URL,
        "custom_settings": res
    }
