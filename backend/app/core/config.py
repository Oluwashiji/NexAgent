"""
Central settings. Everything here is loaded from environment variables
(from your .env file locally, or from Render's env var dashboard in production).

Why this pattern: instead of writing os.getenv("GROQ_API_KEY") in 10 different
files, every other file just does `from app.core.config import settings` and
reads `settings.GROQ_API_KEY`. One source of truth, autocomplete-friendly,
and pydantic validates the types for us.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Groq
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    # Storage
    UPLOAD_DIR: str = "./storage/uploads"
    CHROMA_DIR: str = "./storage/chroma"

    # Chunking
    CHUNK_SIZE: int = 800
    CHUNK_OVERLAP: int = 150

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173"

    @property
    def allowed_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]

    # Phase 2 (not used yet)
    DATABASE_URL: str = ""
    JWT_SECRET_KEY: str = ""
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440


settings = Settings()