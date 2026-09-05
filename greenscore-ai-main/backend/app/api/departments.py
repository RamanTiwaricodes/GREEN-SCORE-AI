from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.entities import Department, ActionAssignment
from app.schemas.dtos import DepartmentResponse

router = APIRouter(prefix="/departments", tags=["Department Management"])

@router.get("", response_model=List[DepartmentResponse])
def get_all_departments(db: Session = Depends(get_db)):
    depts = db.query(Department).all()
    # Recalculate active projects count dynamically
    for d in depts:
        count = db.query(ActionAssignment).filter(
            ActionAssignment.department_id == d.id,
            ActionAssignment.status.in_(["Assigned", "In Progress", "Submitted for Verification"])
        ).count()
        d.active_projects_count = count
    db.commit()
    return depts

@router.get("/{dept_id}")
def get_department_details(dept_id: int, db: Session = Depends(get_db)):
    dept = db.query(Department).filter(Department.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
        
    actions = db.query(ActionAssignment).filter(ActionAssignment.department_id == dept_id).all()
    return {
        "department": dept,
        "actions": actions,
        "total_actions": len(actions),
        "completed_actions": len([a for a in actions if a.status in ["Completed", "Verified"]])
    }
