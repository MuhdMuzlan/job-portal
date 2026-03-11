"""Experience level matching"""

import logging
from typing import Tuple, List

logger = logging.getLogger(__name__)


class ExperienceMatcher:
    """Match experience level between resume and job"""
    
    # Experience level definitions (years)
    EXPERIENCE_LEVELS = {
        'entry': {'min': 0, 'max': 2, 'label': 'Entry Level (0-2 years)'},
        'mid': {'min': 2, 'max': 5, 'label': 'Mid Level (2-5 years)'},
        'senior': {'min': 5, 'max': 8, 'label': 'Senior Level (5-8 years)'},
        'lead': {'min': 8, 'max': 12, 'label': 'Lead Level (8-12 years)'},
        'executive': {'min': 12, 'max': 100, 'label': 'Executive Level (12+ years)'},
    }
    
    async def match(
        self,
        resume_years: float,
        job_level: str
    ) -> Tuple[float, List[str]]:
        """
        Calculate experience match score
        
        Args:
            resume_years: Years of experience from resume
            job_level: Required experience level from job
            
        Returns:
            Tuple of (score, match_reasons)
        """
        level_info = self.EXPERIENCE_LEVELS.get(job_level, self.EXPERIENCE_LEVELS['mid'])
        
        min_years = level_info['min']
        max_years = level_info['max']
        
        # Calculate score
        if resume_years < min_years:
            # Under-experienced
            gap = min_years - resume_years
            score = max(0, 1 - (gap / (min_years + 1)))
            reasons = [
                f"Requires {level_info['label']}",
                f"Current experience: {resume_years:.1f} years",
                f"Experience gap: {gap:.1f} years"
            ]
        elif resume_years > max_years:
            # Over-experienced (still a match, but might be overqualified)
            score = 0.9
            reasons = [
                f"Meets experience requirements",
                f"Has {resume_years:.1f} years ({level_info['label']})",
                "May be overqualified"
            ]
        else:
            # Perfect match
            score = 1.0
            reasons = [
                f"Experience level matches perfectly",
                f"Has {resume_years:.1f} years ({level_info['label']})"
            ]
        
        return score, reasons
    
    def get_level_for_years(self, years: float) -> str:
        """Determine experience level from years"""
        for level, info in self.EXPERIENCE_LEVELS.items():
            if info['min'] <= years < info['max']:
                return level
        return 'executive'
