from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str = "sqlite:///./examination.db"

    # JWT settings
    SECRET_KEY: str = "your-secret-key-here"  # Change this in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS settings
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"


settings = Settings()
