"""Resume parsing routes"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import Optional
import logging

from src.models.resume import (
    ParseResumeRequest,
    ParseResumeResponse,
    ExtractedResume
)
from src.services.resume.parser import ResumeParser

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize parser
resume_parser = ResumeParser()


@router.post("/parse-resume", response_model=ParseResumeResponse)
async def parse_resume(request: ParseResumeRequest):
    """
    Parse resume from file URL
    
    Extracts:
    - Personal information
    - Skills
    - Work experience
    - Education
    """
    try:
        logger.info(f"Parsing resume from URL: {request.file_url}")
        
        result = await resume_parser.parse_from_url(request.file_url)
        
        return ParseResumeResponse(
            success=True,
            data=result
        )
    except Exception as e:
        logger.error(f"Error parsing resume: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/parse-resume-upload", response_model=ParseResumeResponse)
async def parse_resume_upload(file: UploadFile = File(...)):
    """
    Parse resume from uploaded file
    
    Supports: PDF, DOCX
    """
    try:
        logger.info(f"Parsing uploaded resume: {file.filename}")
        
        # Read file content
        content = await file.read()
        
        # Determine file type
        file_ext = file.filename.split(".")[-1].lower() if file.filename else "pdf"
        
        result = await resume_parser.parse_from_bytes(content, file_ext)
        
        return ParseResumeResponse(
            success=True,
            data=result
        )
    except Exception as e:
        logger.error(f"Error parsing uploaded resume: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract-skills")
async def extract_skills(text: str):
    """
    Extract skills from text using NER model
    """
    try:
        skills = await resume_parser.extract_skills(text)
        return {
            "success": True,
            "data": {"skills": skills}
        }
    except Exception as e:
        logger.error(f"Error extracting skills: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
