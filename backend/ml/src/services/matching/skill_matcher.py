"""Skill-based matching"""

import logging
from typing import List, Tuple, Set
from difflib import SequenceMatcher

logger = logging.getLogger(__name__)


class SkillMatcher:
    """Match skills between resume and job"""
    
    def __init__(self, similarity_threshold: float = 0.8):
        self.similarity_threshold = similarity_threshold
        
        # Skill aliases for matching variations
        self.skill_aliases = {
            'javascript': ['js', 'javascript', 'ecmascript'],
            'typescript': ['ts', 'typescript'],
            'python': ['python', 'python3', 'py'],
            'react': ['react', 'reactjs', 'react.js'],
            'node': ['node', 'nodejs', 'node.js'],
            'postgresql': ['postgresql', 'postgres', 'psql'],
            'machine learning': ['ml', 'machine learning', 'machine-learning'],
            'deep learning': ['dl', 'deep learning', 'deep-learning'],
            'aws': ['aws', 'amazon web services'],
        }
    
    async def match(
        self,
        resume_skills: List[str],
        job_skills: List[str]
    ) -> Tuple[float, List[str]]:
        """
        Calculate skill match score
        
        Args:
            resume_skills: Skills from resume
            job_skills: Required skills from job
            
        Returns:
            Tuple of (score, match_reasons)
        """
        if not job_skills:
            return 1.0, ["No specific skills required"]
        
        if not resume_skills:
            return 0.0, ["No skills found in resume"]
        
        # Normalize skills
        resume_skills_normalized = self._normalize_skills(resume_skills)
        job_skills_normalized = self._normalize_skills(job_skills)
        
        # Find matching skills
        matched_skills = []
        partial_matches = []
        
        for job_skill in job_skills_normalized:
            # Exact match
            if job_skill in resume_skills_normalized:
                matched_skills.append(job_skill)
            else:
                # Fuzzy match
                best_match, score = self._find_best_match(
                    job_skill,
                    resume_skills_normalized
                )
                if best_match and score >= self.similarity_threshold:
                    partial_matches.append((job_skill, best_match))
        
        # Calculate score
        total_job_skills = len(job_skills_normalized)
        matched_count = len(matched_skills) + len(partial_matches)
        score = matched_count / total_job_skills if total_job_skills > 0 else 1.0
        
        # Generate match reasons
        reasons = []
        if matched_skills:
            reasons.append(f"Matches {len(matched_skills)} required skills: {', '.join(matched_skills[:5])}")
        if partial_matches:
            reasons.append(f"Partially matches {len(partial_matches)} skills")
        
        missing_count = total_job_skills - matched_count
        if missing_count > 0:
            reasons.append(f"Missing {missing_count} required skills")
        
        return score, reasons
    
    def _normalize_skills(self, skills: List[str]) -> Set[str]:
        """Normalize skill names"""
        normalized = set()
        
        for skill in skills:
            skill_lower = skill.lower().strip()
            
            # Check aliases
            for main_skill, aliases in self.skill_aliases.items():
                if skill_lower in aliases:
                    normalized.add(main_skill)
                    break
            else:
                normalized.add(skill_lower)
        
        return normalized
    
    def _find_best_match(
        self,
        skill: str,
        candidates: Set[str]
    ) -> Tuple[str, float]:
        """Find best matching skill using fuzzy matching"""
        best_match = None
        best_score = 0
        
        for candidate in candidates:
            score = SequenceMatcher(None, skill, candidate).ratio()
            if score > best_score:
                best_score = score
                best_match = candidate
        
        return best_match, best_score
