"""Skill extractor using NER and pattern matching"""

import logging
import re
from typing import List, Set
import json
from pathlib import Path

logger = logging.getLogger(__name__)


class SkillExtractor:
    """Extract skills from text using multiple methods"""
    
    def __init__(self):
        self.skill_patterns = self._load_skill_patterns()
    
    def _load_skill_patterns(self) -> Set[str]:
        """Load skill patterns from data file"""
        skills = set()
        
        # Default tech skills
        default_skills = [
            # Programming languages
            'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala',
            # Frontend
            'react', 'vue', 'angular', 'next.js', 'svelte', 'html', 'css', 'tailwind', 'bootstrap',
            # Backend
            'node.js', 'express', 'django', 'flask', 'fastapi', 'spring', 'rails', 'asp.net',
            # Databases
            'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'sqlite', 'oracle',
            # Cloud/DevOps
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'jenkins', 'github actions',
            # Data Science/ML
            'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'nlp',
            # Mobile
            'react native', 'flutter', 'ios', 'android',
            # Other
            'git', 'agile', 'scrum', 'rest api', 'graphql', 'microservices', 'linux', 'bash',
        ]
        
        skills.update(s.lower() for s in default_skills)
        return skills
    
    async def extract(self, text: str) -> List[str]:
        """
        Extract skills from text
        
        Args:
            text: Text to extract skills from
            
        Returns:
            List of found skills
        """
        found_skills = set()
        text_lower = text.lower()
        
        # Method 1: Direct pattern matching
        for skill in self.skill_patterns:
            if skill.lower() in text_lower:
                found_skills.add(skill)
        
        # Method 2: Look for skill sections
        skills_section = self._extract_skills_section(text)
        if skills_section:
            # Extract skills from bullet points
            bullet_skills = self._extract_bullet_points(skills_section)
            found_skills.update(s.lower() for s in bullet_skills)
        
        # Method 3: Look for skill-related phrases
        phrase_skills = self._extract_skill_phrases(text)
        found_skills.update(s.lower() for s in phrase_skills)
        
        return list(found_skills)
    
    def _extract_skills_section(self, text: str) -> str:
        """Extract the skills section from text"""
        patterns = [
            r'skills?[:\s]+(.*?)(?=\n\n|\n[A-Z]|$)',
            r'technical skills[:\s]+(.*?)(?=\n\n|\n[A-Z]|$)',
            r'competencies[:\s]+(.*?)(?=\n\n|\n[A-Z]|$)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
            if match:
                return match.group(1)
        
        return ''
    
    def _extract_bullet_points(self, text: str) -> List[str]:
        """Extract items from bullet points or comma-separated lists"""
        # Split by common delimiters
        items = re.split(r'[,•·|\n]+', text)
        return [item.strip() for item in items if item.strip()]
    
    def _extract_skill_phrases(self, text: str) -> List[str]:
        """Extract skills from common phrases"""
        skills = []
        
        # Pattern: "Proficient in X", "Experience with X", etc.
        patterns = [
            r'proficient in ([\w\s\+\#\.]+)',
            r'experience (?:with|in) ([\w\s\+\#\.]+)',
            r'knowledge of ([\w\s\+\#\.]+)',
            r'skilled in ([\w\s\+\#\.]+)',
            r'expertise in ([\w\s\+\#\.]+)',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                # Clean up and add
                skill = match.strip()
                if len(skill) < 50:  # Reasonable skill name length
                    skills.append(skill)
        
        return skills
