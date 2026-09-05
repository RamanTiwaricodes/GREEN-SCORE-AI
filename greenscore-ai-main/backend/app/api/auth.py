from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.entities import User, Department
from app.schemas.dtos import LoginRequest, Token, UserResponse, UserCreate
from app.core.security import verify_password, get_password_hash, create_access_token, get_current_user
import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login_data.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    dept_name = user.department.name if user.department else None
    token_data = {
        "sub": str(user.id),
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "department_id": user.department_id,
        "department_name": dept_name
    }
    
    token = create_access_token(data=token_data)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": token_data
    }

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
