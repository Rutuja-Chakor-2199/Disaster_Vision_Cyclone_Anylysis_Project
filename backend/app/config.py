import os
from dotenv import load_dotenv
from typing import List

load_dotenv()

class Settings:
    # API Configuration
    API_HOST: str = os.getenv("API_HOST", "127.0.0.1")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    
    # Database Configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./disaster_vision.db")
    
    # External API Keys
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")
    NOAA_API_KEY: str = os.getenv("NOAA_API_KEY", "")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FILE: str = os.getenv("LOG_FILE", "logs/app.log")
    
    @property
    def database_url_sync(self) -> str:
        """Get synchronous database URL for SQLAlchemy"""
        if self.DATABASE_URL.startswith("postgresql+asyncpg://"):
            return self.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
        return self.DATABASE_URL

settings = Settings()
