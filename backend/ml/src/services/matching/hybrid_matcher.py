"""Hybrid job matching service"""

import logging
from typing import List, Dict, Any, Optional
import asyncio

from src.services.embedding.generator import EmbeddingGenerator
from src.services.matching.skill_matcher import SkillMatcher
from src.services.matching.experience_matcher import ExperienceMatcher
from src.services.matching.semantic_matcher import SemanticMatcher
from src.models.matching import JobMatchData

logger = logging.getLogger(__name__)


class HybridMatcher:
    """
    Hybrid job matching combining multiple algorithms
    
    Combines:
    - Semantic similarity (embeddings)
    - Skill matching
    - Experience level matching
    """
    
    def __init__(self):
        self.embedding_generator = EmbeddingGenerator()
        self.skill_matcher = SkillMatcher()
        self.experience_matcher = ExperienceMatcher()
        self.semantic_matcher = SemanticMatcher()
        
        # Weights for different matching components
        self.weights = {
            'semantic': 0.4,
            'skill': 0.4,
            'experience': 0.2,
        }
    
    async def get_recommendations(
        self,
        resume_id: str,
        limit: int = 10
    ) -> List[JobMatchData]:
        """
        Get job recommendations for a resume
        
        Args:
            resume_id: Resume ID to match
            limit: Maximum number of recommendations
            
        Returns:
            List of job matches sorted by score
        """
        # In production, fetch resume and jobs from database
        # For now, return placeholder data
        
        # Get all active jobs (from database)
        jobs = await self._get_active_jobs()
        
        # Get resume embedding and skills
        resume_data = await self._get_resume_data(resume_id)
        
        # Calculate match scores for all jobs
        match_tasks = [
            self._calculate_match_score(resume_data, job)
            for job in jobs
        ]
        
        matches = await asyncio.gather(*match_tasks)
        
        # Sort by overall match score
        matches.sort(key=lambda x: x['match_score'], reverse=True)
        
        # Return top matches
        return matches[:limit]
    
    async def calculate_match(
        self,
        resume_id: str,
        job_id: str
    ) -> JobMatchData:
        """
        Calculate match score between resume and job
        
        Args:
            resume_id: Resume ID
            job_id: Job ID
            
        Returns:
            Match result with detailed scores
        """
        # Fetch data
        resume_data = await self._get_resume_data(resume_id)
        job_data = await self._get_job_data(job_id)
        
        return await self._calculate_match_score(resume_data, job_data)
    
    async def _calculate_match_score(
        self,
        resume: Dict[str, Any],
        job: Dict[str, Any]
    ) -> JobMatchData:
        """Calculate all matching components"""
        
        # Calculate individual scores
        semantic_score = await self.semantic_matcher.match(
            resume.get('embedding', []),
            job.get('embedding', [])
        )
        
        skill_score, skill_reasons = await self.skill_matcher.match(
            resume.get('skills', []),
            job.get('skills_required', [])
        )
        
        exp_score, exp_reasons = await self.experience_matcher.match(
            resume.get('experience_years', 0),
            job.get('experience_level', 'mid')
        )
        
        # Calculate weighted overall score
        overall_score = (
            self.weights['semantic'] * semantic_score +
            self.weights['skill'] * skill_score +
            self.weights['experience'] * exp_score
        )
        
        # Combine match reasons
        match_reasons = []
        match_reasons.extend(skill_reasons)
        match_reasons.extend(exp_reasons)
        
        if semantic_score > 0.7:
            match_reasons.append("Strong semantic match with job description")
        
        return JobMatchData(
            job_id=job.get('id', ''),
            job_title=job.get('title', ''),
            company_name=job.get('company_name', ''),
            match_score=round(overall_score * 100, 1),
            skill_match_score=round(skill_score * 100, 1),
            experience_match_score=round(exp_score * 100, 1),
            semantic_match_score=round(semantic_score * 100, 1),
            match_reasons=match_reasons[:5]  # Top 5 reasons
        )
    
    async def _get_active_jobs(self) -> List[Dict[str, Any]]:
        """Fetch active jobs from database"""
        # Placeholder - in production, query database
        return []
    
    async def _get_resume_data(self, resume_id: str) -> Dict[str, Any]:
        """Fetch resume data from database"""
        # Placeholder - in production, query database
        return {
            'id': resume_id,
            'skills': [],
            'embedding': [],
            'experience_years': 0
        }
    
    async def _get_job_data(self, job_id: str) -> Dict[str, Any]:
        """Fetch job data from database"""
        # Placeholder - in production, query database
        return {
            'id': job_id,
            'title': '',
            'skills_required': [],
            'embedding': [],
            'experience_level': 'mid'
        }
