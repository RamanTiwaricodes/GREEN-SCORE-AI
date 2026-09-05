from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import random
import datetime
from app.database.session import get_db
from app.models.entities import CitizenReport, Zone, Department, ActionAssignment, Problem, AuditLog
from app.schemas.dtos import CitizenReportCreate, CitizenReportResponse
from app.services.ai.vision_classifier import vision_classifier

router = APIRouter(prefix="/citizen-reports", tags=["Citizen Reporting & Tracking"])

@router.post("/submit", response_model=CitizenReportResponse)
def submit_citizen_report(report_data: CitizenReportCreate, db: Session = Depends(get_db)):
    # Generate unique ID GS-2026-XXXXXX
    rnd_suffix = f"{random.randint(100000, 999999)}"
    tracking_id = f"GS-2026-{rnd_suffix}"
    
    # Run AI Classification
    ai_eval = vision_classifier.classify_issue(report_data.description, report_data.photo_url)
    
    report = CitizenReport(
        tracking_id=tracking_id,
        citizen_name=report_data.citizen_name,
        citizen_phone=report_data.citizen_phone,
        category=report_data.category or ai_eval["category"],
        severity=ai_eval["severity"],
        description=report_data.description,
        zone_id=report_data.zone_id,
        latitude=report_data.latitude,
        longitude=report_data.longitude,
        address=report_data.address,
        photo_url=report_data.photo_url,
        status="AI Classified",
        ai_category=ai_eval["category"],
        ai_severity=ai_eval["severity"],
        ai_suggested_dept=ai_eval["suggested_department"],
        ai_confidence=ai_eval["confidence_pct"],
        ai_reason=ai_eval["reason"]
    )
    db.add(report)
    
    # Increment zone open issues count
    zone = db.query(Zone).filter(Zone.id == report_data.zone_id).first()
    if zone:
        zone.open_issues_count = (zone.open_issues_count or 0) + 1
        
    db.commit()
    db.refresh(report)
    
    return CitizenReportResponse(
        id=report.id,
        tracking_id=report.tracking_id,
        citizen_name=report.citizen_name,
        category=report.category,
        severity=report.severity,
        description=report.description,
        zone_id=report.zone_id,
        zone_name=zone.name if zone else "Lucknow",
        latitude=report.latitude,
        longitude=report.longitude,
        address=report.address,
        photo_url=report.photo_url,
        status=report.status,
        ai_category=report.ai_category,
        ai_severity=report.ai_severity,
        ai_suggested_dept=report.ai_suggested_dept,
        ai_confidence=report.ai_confidence,
        ai_reason=report.ai_reason,
        created_at=report.created_at,
        resolved_at=report.resolved_at
    )

@router.get("/track/{tracking_id}", response_model=CitizenReportResponse)
def track_report_by_id(tracking_id: str, db: Session = Depends(get_db)):
    report = db.query(CitizenReport).filter(CitizenReport.tracking_id == tracking_id.strip().upper()).first()
    if not report:
        raise HTTPException(status_code=404, detail=f"No citizen report found with Tracking ID '{tracking_id}'")
        
    zone = db.query(Zone).filter(Zone.id == report.zone_id).first()
    
    return CitizenReportResponse(
        id=report.id,
        tracking_id=report.tracking_id,
        citizen_name=report.citizen_name,
        category=report.category,
        severity=report.severity,
        description=report.description,
        zone_id=report.zone_id,
        zone_name=zone.name if zone else "Lucknow",
        latitude=report.latitude,
        longitude=report.longitude,
        address=report.address,
        photo_url=report.photo_url,
        status=report.status,
        ai_category=report.ai_category,
        ai_severity=report.ai_severity,
        ai_suggested_dept=report.ai_suggested_dept,
        ai_confidence=report.ai_confidence,
        ai_reason=report.ai_reason,
        created_at=report.created_at,
        resolved_at=report.resolved_at
    )

@router.get("", response_model=List[CitizenReportResponse])
def list_all_citizen_reports(zone_id: Optional[int] = None, status_filter: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(CitizenReport)
    if zone_id:
        query = query.filter(CitizenReport.zone_id == zone_id)
    if status_filter:
        query = query.filter(CitizenReport.status == status_filter)
        
    reports = query.order_by(CitizenReport.created_at.desc()).all()
    resp = []
    for r in reports:
        z = db.query(Zone).filter(Zone.id == r.zone_id).first()
        resp.append(CitizenReportResponse(
            id=r.id,
            tracking_id=r.tracking_id,
            citizen_name=r.citizen_name,
            category=r.category,
            severity=r.severity,
            description=r.description,
            zone_id=r.zone_id,
            zone_name=z.name if z else "Lucknow",
            latitude=r.latitude,
            longitude=r.longitude,
            address=r.address,
            photo_url=r.photo_url,
            status=r.status,
            ai_category=r.ai_category,
            ai_severity=r.ai_severity,
            ai_suggested_dept=r.ai_suggested_dept,
            ai_confidence=r.ai_confidence,
            ai_reason=r.ai_reason,
            created_at=r.created_at,
            resolved_at=r.resolved_at
        ))
    return resp

@router.patch("/{report_id}/status")
def update_report_status(report_id: int, new_status: str, db: Session = Depends(get_db)):
    report = db.query(CitizenReport).filter(CitizenReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report.status = new_status
    if new_status in ["Resolved", "Verified"]:
        report.resolved_at = datetime.datetime.utcnow()
    db.commit()
    return {"message": f"Report {report.tracking_id} updated to {new_status}", "status": report.status}
