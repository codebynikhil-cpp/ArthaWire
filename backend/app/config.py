import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from project root or backend folder
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "FinPulse"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    
    # Database: SQLite for local dev, PostgreSQL ready
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./finpulse.db")
    
    # Official X API v2 credentials
    X_BEARER_TOKEN: str = os.getenv("X_BEARER_TOKEN", "")
    X_API_KEY: str = os.getenv("X_API_KEY", "")
    X_API_SECRET: str = os.getenv("X_API_SECRET", "")
    
    # Ingestion settings
    MAX_MONITORED_CREATORS: int = int(os.getenv("MAX_MONITORED_CREATORS", "10"))
    DEFAULT_POLL_INTERVAL_MINUTES: int = int(os.getenv("DEFAULT_POLL_INTERVAL_MINUTES", "15"))
    
    # Ingestion mode: If True, uses realistic simulated Indian finance stream when no bearer token or when explicitly set
    SIMULATION_MODE: bool = os.getenv("SIMULATION_MODE", "true").lower() in ("true", "1", "yes") or not bool(os.getenv("X_BEARER_TOKEN"))
    
    # NLP Model choice
    USE_FINBERT_TRANSFORMERS: bool = os.getenv("USE_FINBERT_TRANSFORMERS", "true").lower() in ("true", "1", "yes")
    FINBERT_MODEL_NAME: str = os.getenv("FINBERT_MODEL_NAME", "ProsusAI/finbert")
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "*"
    ]

settings = Settings()

