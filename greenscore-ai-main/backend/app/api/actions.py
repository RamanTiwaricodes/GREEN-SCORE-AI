from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import datetime
import random
from app.database.session import get_db
from app.models.entities import ActionAssignment, Problem, Zone, Department, User, ImpactVerification, AuditLog
from app.schemas.dtos import ActionAssignmentCreate, ActionProgressUpdate, ActionAssignmentResponse

router = APIRouter(prefix="/actions", tags=["Department Action Workflow"])

@router.get("", response_model=List[ActionAssignmentResponse])
def get_all_actions(
    department_id: Optional[int] = None,
    zone_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ActionAssignment)
    if department_id:
        query = query.filter(ActionAssignment.department_id == department_id)
    if zone_id:
        query = query.filter(ActionAssignment.zone_id == zone_id)
    if status_filter:
        query = query.filter(ActionAssignment.status == status_filter)
        
    actions = query.order_by(ActionAssignment.created_at.desc()).all()
    resp = []
    for a in actions:
        z = db.query(Zone).filter(Zone.id == a.zone_id).first()
        d = db.query(Department).filter(Department.id == a.department_id).first()
        u = db.query(User).filter(User.id == a.assigned_officer_id).first() if a.assigned_officer_id else None
        
        resp.append(ActionAssignmentResponse(
            id=a.id,
            action_code=a.action_code,
            title=a.title,
            problem_id=a.problem_id,
            zone_id=a.zone_id,
            zone_name=z.name if z else "Lucknow",
            department_id=a.department_id,
            department_name=d.name if d else "Municipal Sanitation",
            assigned_officer_id=a.assigned_officer_id,
            assigned_officer_name=u.full_name if u else "Department Field Lead",
            status=a.status,
            progress_pct=a.progress_pct,
            estimated_cost=a.estimated_cost,
            actual_cost=a.actual_cost,
            deadline=a.deadline,
            completion_date=a.completion_date,
            evidence_notes=a.evidence_notes,
            evidence_photo_url=a.evidence_photo_url,
            created_at=a.created_at
        ))
    return resp

@router.post("/assign", response_model=ActionAssignmentResponse)
def assign_action(action_data: ActionAssignmentCreate, db: Session = Depends(get_db)):
    code_suffix = f"{random.randint(1000, 9999)}"
    action_code = f"ACT-2026-{code_suffix}"
    
    action = ActionAssignment(
        action_code=action_code,
        title=action_data.title,
        problem_id=action_data.problem_id,
        zone_id=action_data.zone_id,
        department_id=action_data.department_id,
        assigned_officer_id=action_data.assigned_officer_id,
        estimated_cost=action_data.estimated_cost,
        actual_cost=0.0,
        deadline=action_data.deadline,
        status="Assigned",
        progress_pct=0
    )
    db.add(action)
    
    # Update department active projects count
    dept = db.query(Department).filter(Department.id == action_data.department_id).first()
    if dept:
        dept.active_projects_count = (dept.active_projects_count or 0) + 1
        
    db.commit()
    db.refresh(action)
    
    z = db.query(Zone).filter(Zone.id == action.zone_id).first()
    u = db.query(User).filter(User.id == action.assigned_officer_id).first() if action.assigned_officer_id else None
    
    return ActionAssignmentResponse(
        id=action.id,
        action_code=action.action_code,
        title=action.title,
        problem_id=action.problem_id,
        zone_id=action.zone_id,
        zone_name=z.name if z else "Lucknow",
        department_id=action.department_id,
        department_name=dept.name if dept else "Municipal Sanitation",
        assigned_officer_id=action.assigned_officer_id,
        assigned_officer_name=u.full_name if u else "Assigned Officer",
        status=action.status,
        progress_pct=action.progress_pct,
        estimated_cost=action.estimated_cost,
        actual_cost=action.actual_cost,
        deadline=action.deadline,
        completion_date=action.completion_date,
        evidence_notes=action.evidence_notes,
        evidence_photo_url=action.evidence_photo_url,
        created_at=action.created_at
    )

@router.patch("/{action_id}/progress")
def update_action_progress(action_id: int, update: ActionProgressUpdate, db: Session = Depends(get_db)):
    action = db.query(ActionAssignment).filter(ActionAssignment.id == action_id).first()
    if not action:
        raise HTTPException(status_code=404, detail="Action not found")
        
    action.progress_pct = update.progress_pct
    if update.actual_cost is not None:
        action.actual_cost = update.actual_cost
    if update.evidence_notes:
        action.evidence_notes = update.evidence_notes
    if update.evidence_photo_url:
        action.evidence_photo_url = update.evidence_photo_url
        
    if update.status:
        action.status = update.status
    else:
        if update.progress_pct == 100:
            action.status = "Completed"
            action.completion_date = datetime.datetime.utcnow()
        elif update.progress_pct > 0:
            action.status = "In Progress"
            
    db.commit()
    return {
        "message": f"Action {action.action_code} progress updated to {action.progress_pct}%",
        "action_code": action.action_code,
        "progress_pct": action.progress_pct,
        "status": action.status
    }
