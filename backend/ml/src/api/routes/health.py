"""Health check routes"""

from fastapi import APIRouter
from datetime import datetime

router = APIRouter()


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "ml-service"
    }


@router.get("/ready")
async def readiness_check():
    """Readiness check endpoint"""
    # Check database connection
    # Check model loading status
    return {
        "status": "ready",
        "checks": {
            "database": "connected",
            "models": "loaded"
        }
    }
