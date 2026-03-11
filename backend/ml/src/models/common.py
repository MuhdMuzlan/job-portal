"""Common Pydantic models"""

from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class EmbeddingRequest(BaseModel):
    """Request to generate embedding"""
    text: str


class EmbeddingResponse(BaseModel):
    """Response with embedding"""
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    timestamp: str
    service: str


class APIResponse(BaseModel):
    """Generic API response"""
    success: bool
    data: Optional[Any] = None
    message: Optional[str] = None
    error: Optional[str] = None
