import os
from typing import List

class Settings:
    PROJECT_NAME: str = "GREENScore AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    TAGLINE: str = "Predict. Prioritize. Optimize. Act. Measure."
    
    # DB
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./greenscore.db")
    
    # Auth
    JWT_SECRET: str = os.getenv("JWT_SECRET", "greenscore_orbit_secret_key_2026_super_secure")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # API Keys
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "")
    OPENAQ_API_KEY: str = os.getenv("OPENAQ_API_KEY", "")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", os.getenv("OPENAI_API_KEY", ""))
    VISION_API_KEY: str = os.getenv("VISION_API_KEY", "")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
