"""
Application Configuration
Loads settings from environment variables or uses verified default values.
"""

from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


# Project Root Directories
APP_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = APP_DIR.parent
WORKSPACE_DIR = BACKEND_DIR.parent


class Settings(BaseSettings):
    """Core settings for Arpan AI Portfolio RAG."""
    
    # Project Info
    PROJECT_NAME: str = "Arpan AI Portfolio Assistant"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    # Knowledge Base Path
    PORTFOLIO_JSON_PATH: Path = BACKEND_DIR / "knowledge_base" / "portfolio.json"
    
    # ChromaDB Vector Store
    CHROMA_PERSIST_DIRECTORY: Path = BACKEND_DIR / "chroma_db"
    CHROMA_COLLECTION_NAME: str = "portfolio_collection"
    
    # Embedding Model Settings
    EMBEDDING_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384
    
    # Text Chunking Settings
    CHUNK_SIZE: int = 400      # Target token/word count
    CHUNK_OVERLAP: int = 60    # Overlap count
    
    # Retrieval Settings
    RELEVANCE_THRESHOLD: float = 0.30  # Minimum cosine similarity for portfolio context (safely excludes irrelevant queries < 0.20)
    TOP_K: int = 4
    
    # Groq API
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "openai/gpt-oss-120b"

    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
