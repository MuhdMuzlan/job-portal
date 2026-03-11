"""Pydantic models for job matching"""

from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class JobMatchData(BaseModel):
    """Job match result"""
    job_id: str
    job_title: str
    company_name: str
    match_score: float
    skill_match_score: float
    experience_match_score: float
    semantic_match_score: float
    match_reasons: List[str]


class MatchResult(BaseModel):
    """Match calculation result"""
    success: bool
    data: Optional[JobMatchData] = None
    error: Optional[str] = None


class CalculateMatchRequest(BaseModel):
    """Request to calculate match score"""
    resume_id: str
    job_id: str


class RecommendationsRequest(BaseModel):
    """Request for job recommendations"""
    resume_id: str
    limit: Optional[int] = 10


class RecommendationsResponse(BaseModel):
    """Response with job recommendations"""
    success: bool
    data: Optional[List[JobMatchData]] = None
    error: Optional[str] = None


class MatchBreakdown(BaseModel):
    """Detailed match breakdown"""
    category: str
    score: float
    max_score: float
    details: List[str]
