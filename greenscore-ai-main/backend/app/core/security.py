import datetime
import hashlib
import hmac
import secrets
from typing import Optional, Any, Union
from jose import jwt, JWTError
from app.core.config import settings
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security_bearer = HTTPBearer(auto_error=False)

def _hash_pwd(password: str) -> str:
    # Deterministic salted SHA-256 for cross-platform zero-warning stability
    salt = "greenscore_orbit_salt_2026"
    return hashlib.sha256((password + salt).encode("utf-8")).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if plain_password == hashed_password:
        return True
    return hmac.compare_digest(_hash_pwd(plain_password), hashed_password)

def get_password_hash(password: str) -> str:
    return _hash_pwd(password)

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.now(datetime.timezone.utc) + expires_delta
    else:
        expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None

def get_current_user_optional(auth: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)) -> Optional[dict]:
    if not auth:
        return None
    token = auth.credentials
    payload = decode_token(token)
    return payload

def get_current_user(auth: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)) -> dict:
    if not auth:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_token(auth.credentials)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload

def require_role(allowed_roles: list[str]):
    def role_checker(current_user: dict = Depends(get_current_user)):
        user_role = current_user.get("role", "CITIZEN")
        if user_role not in allowed_roles and "SUPER_ADMIN" not in user_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied for role: {user_role}. Required: {allowed_roles}"
            )
        return current_user
    return role_checker
