"""
FastAPI Application Entry Point.
Initializes lifespan events, CORS middleware, API routers, and health checks.
Stage 3 of Arpan AI Portfolio RAG.
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes.chat import router as chat_router
from app.api.routes.jd import router as jd_router
from app.services.vector_store import vector_store
from app.services.embedding_service import embedding_service
from scripts.ingest import run_ingestion

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("arpan_ai_app")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application Lifespan Context Manager.
    Pre-warms embedding model and ensures ChromaDB collection is populated.
    Rebuilds index automatically if deployed to an ephemeral host without persistent storage.
    """
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}...")
    
    # 1. Check ChromaDB collection status
    try:
        count = vector_store.get_count()
        if count == 0:
            logger.info("ChromaDB collection is empty. Running automatic seed ingestion...")
            run_ingestion(reset=False)
        else:
            logger.info(f"ChromaDB ready with {count} indexed portfolio chunks.")
    except Exception as e:
        logger.warning(f"Could not verify or auto-seed ChromaDB on startup: {e}")

    # 2. Pre-warm embedding service
    try:
        dim = embedding_service.get_dimension()
        logger.info(f"Embedding model pre-warmed: {settings.EMBEDDING_MODEL_NAME} ({dim} dims).")
    except Exception as e:
        logger.warning(f"Embedding service pre-warm notice: {e}")

    yield

    logger.info("Shutting down Arpan AI Backend...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-oriented Personal Portfolio RAG Assistant named Arpan Bot.",
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration for local React dev & production portfolio deployment
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://arpan-two.vercel.app",
    "https://arpanbanik.dev",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(chat_router)
app.include_router(jd_router)


@app.get("/", tags=["General"])
def root():
    """Root endpoint for status check."""
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs",
    }


@app.get("/health", tags=["General"])
def health():
    """Health check endpoint for container / hosting monitors."""
    return {
        "status": "healthy",
        "collection": settings.CHROMA_COLLECTION_NAME,
        "model": settings.GROQ_MODEL,
    }
