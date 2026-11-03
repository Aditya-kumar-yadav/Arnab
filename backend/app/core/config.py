import os
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "PATHFINDER AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database: Default to local SQLite database for zero-config out of the box,
    # or override with DATABASE_URL for PostgreSQL on Render
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./pathfinder.db")
    
    # Clerk Authentication
    CLERK_SECRET_KEY: str = os.getenv("CLERK_SECRET_KEY", "sk_test_placeholder_key")
    CLERK_PUBLISHABLE_KEY: str = os.getenv("CLERK_PUBLISHABLE_KEY", "pk_test_placeholder_key")
    CLERK_WEBHOOK_SECRET: str = os.getenv("CLERK_WEBHOOK_SECRET", "")
    
    # JWT Settings (for fallback/standalone secure tokens)
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secure-pathfinder-secret-key-change-in-prod-2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Frontend URL (for explicit CORS binding)
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # CORS Origins (accepts List or comma-separated string from env)
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://localhost:8000"
    ]
    
    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_database_url(cls, v: str) -> str:
        if isinstance(v, str) and v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v
        
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            import json
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        elif isinstance(v, list):
            return v
        return []
    
    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env", extra="ignore")

settings = Settings()
