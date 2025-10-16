from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://curtin:curtin@localhost:5432/curtin"
    DATABASE_URL_TEST: str = "postgresql://curtin:curtin@localhost:5432/curtin_test"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Application
    APP_DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

    @property
    def DEBUG(self) -> bool:
        """Alias for APP_DEBUG to avoid conflicts with system DEBUG env var"""
        return self.APP_DEBUG


settings = Settings()

