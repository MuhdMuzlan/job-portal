"""Pydantic models for resume parsing"""

from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class ParsedExperience(BaseModel):
    """Work experience entry"""
    title: str
    company: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    current: bool = False
    description: Optional[str] = None


class ParsedEducation(BaseModel):
    """Education entry"""
    degree: str
    institution: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    gpa: Optional[str] = None


class ExtractedResume(BaseModel):
    """Extracted resume data"""
    # Personal info
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    website: Optional[str] = None
    
    # Content
    summary: Optional[str] = None
    skills: List[str] = []
    experience: List[ParsedExperience] = []
    education: List[ParsedEducation] = []
    
    # Metadata
    total_experience_years: Optional[float] = None
    raw_text: Optional[str] = None
    
    # Embedding
    embedding: Optional[List[float]] = None


class ParseResumeRequest(BaseModel):
    """Request to parse resume from URL"""
    file_url: str


class ParseResumeResponse(BaseModel):
    """Response from resume parsing"""
    success: bool
    data: Optional[ExtractedResume] = None
    error: Optional[str] = None
