"""
Job Portal ML Service
FastAPI application for resume parsing and job matching
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from src.config import settings
from src.api.routes import resume, matching, embedding, health

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    logger.info("Starting ML Service...")
    # Load models on startup
    # In production, pre-load models here
    yield
    logger.info("Shutting down ML Service...")


app = FastAPI(
    title="Job Portal ML Service",
    description="AI-powered resume parsing and job matching service",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(resume.router, prefix="/api/v1", tags=["Resume Parsing"])
app.include_router(matching.router, prefix="/api/v1/matching", tags=["Job Matching"])
app.include_router(embedding.router, prefix="/api/v1", tags=["Embedding Generation"])


@app.get("/")
async def root():
    return {
        "service": "Job Portal ML Service",
        "version": "1.0.0",
        "status": "running"
    }
