"""Job matching routes"""

from fastapi import APIRouter, HTTPException
from typing import List, Optional
import logging

from src.models.matching import (
    CalculateMatchRequest,
    MatchResult,
    RecommendationsRequest,
    RecommendationsResponse
)
from src.services.matching.hybrid_matcher import HybridMatcher

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize matcher
matcher = HybridMatcher()


@router.post("/recommendations", response_model=RecommendationsResponse)
async def get_recommendations(request: RecommendationsRequest):
    """
    Get job recommendations for a resume
    
    Uses hybrid matching:
    - Semantic similarity (embeddings)
    - Skill matching
    - Experience level matching
    """
    try:
        logger.info(f"Getting recommendations for resume: {request.resume_id}")
        
        recommendations = await matcher.get_recommendations(
            resume_id=request.resume_id,
            limit=request.limit or 10
        )
        
        return RecommendationsResponse(
            success=True,
            data=recommendations
        )
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/calculate", response_model=MatchResult)
async def calculate_match(request: CalculateMatchRequest):
    """
    Calculate match score between resume and job
    
    Returns:
    - Overall match score (0-100)
    - Skill match score
    - Experience match score
    - Semantic match score
    - Match reasons
    """
    try:
        logger.info(f"Calculating match: resume={request.resume_id}, job={request.job_id}")
        
        result = await matcher.calculate_match(
            resume_id=request.resume_id,
            job_id=request.job_id
        )
        
        return MatchResult(
            success=True,
            data=result
        )
    except Exception as e:
        logger.error(f"Error calculating match: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/batch-calculate")
async def batch_calculate_matches(
    resume_id: str,
    job_ids: List[str]
):
    """
    Calculate match scores for multiple jobs
    """
    try:
        results = []
        for job_id in job_ids:
            result = await matcher.calculate_match(
                resume_id=resume_id,
                job_id=job_id
            )
            results.append(result)
        
        # Sort by match score
        results.sort(key=lambda x: x["match_score"], reverse=True)
        
        return {
            "success": True,
            "data": results
        }
    except Exception as e:
        logger.error(f"Error in batch match calculation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
