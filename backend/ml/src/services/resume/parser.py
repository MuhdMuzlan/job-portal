"""
Resume Parser Service
Main orchestrator for resume parsing
"""

import logging
from typing import Optional, List, Dict, Any
import httpx
import re

from src.services.resume.pdf_extractor import PDFExtractor
from src.services.resume.docx_extractor import DocxExtractor
from src.services.resume.section_splitter import SectionSplitter
from src.services.nlp.skill_extractor import SkillExtractor
from src.services.nlp.ner_extractor import NERExtractor
from src.services.embedding.generator import EmbeddingGenerator
from src.models.resume import ExtractedResume, ParsedExperience, ParsedEducation

logger = logging.getLogger(__name__)


class ResumeParser:
    """Main resume parser orchestrator"""
    
    def __init__(self):
        self.pdf_extractor = PDFExtractor()
        self.docx_extractor = DocxExtractor()
        self.section_splitter = SectionSplitter()
        self.skill_extractor = SkillExtractor()
        self.ner_extractor = NERExtractor()
        self.embedding_generator = EmbeddingGenerator()
    
    async def parse_from_url(self, file_url: str) -> ExtractedResume:
        """Parse resume from URL"""
        async with httpx.AsyncClient() as client:
            response = await client.get(file_url)
            content = response.content
        
        # Determine file type from URL
        if file_url.lower().endswith('.pdf'):
            return await self.parse_from_bytes(content, 'pdf')
        elif file_url.lower().endswith(('.docx', '.doc')):
            return await self.parse_from_bytes(content, 'docx')
        else:
            # Default to PDF
            return await self.parse_from_bytes(content, 'pdf')
    
    async def parse_from_bytes(self, content: bytes, file_type: str) -> ExtractedResume:
        """Parse resume from bytes content"""
        # Extract text
        if file_type == 'pdf':
            text = await self.pdf_extractor.extract(content)
        elif file_type == 'docx':
            text = await self.docx_extractor.extract(content)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
        
        # Parse the extracted text
        return await self._parse_text(text)
    
    async def _parse_text(self, text: str) -> ExtractedResume:
        """Parse extracted text into structured data"""
        # Split into sections
        sections = self.section_splitter.split(text)
        
        # Extract named entities
        entities = await self.ner_extractor.extract(text)
        
        # Extract skills
        skills = await self.skill_extractor.extract(text)
        
        # Parse experience
        experience = self._parse_experience(sections.get('experience', ''))
        
        # Parse education
        education = self._parse_education(sections.get('education', ''))
        
        # Calculate total experience years
        total_years = self._calculate_experience_years(experience)
        
        # Generate embedding
        embedding = await self.embedding_generator.generate(text)
        
        return ExtractedResume(
            full_name=entities.get('name'),
            email=self._extract_email(text),
            phone=self._extract_phone(text),
            location=entities.get('location'),
            linkedin=self._extract_linkedin(text),
            website=self._extract_website(text),
            summary=sections.get('summary', ''),
            skills=skills,
            experience=experience,
            education=education,
            total_experience_years=total_years,
            raw_text=text,
            embedding=embedding
        )
    
    async def extract_skills(self, text: str) -> List[str]:
        """Extract skills from text"""
        return await self.skill_extractor.extract(text)
    
    def _extract_email(self, text: str) -> Optional[str]:
        """Extract email from text"""
        pattern = r'[\w\.-]+@[\w\.-]+\.\w+'
        match = re.search(pattern, text)
        return match.group(0) if match else None
    
    def _extract_phone(self, text: str) -> Optional[str]:
        """Extract phone number from text"""
        pattern = r'(\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})'
        match = re.search(pattern, text)
        return match.group(0) if match else None
    
    def _extract_linkedin(self, text: str) -> Optional[str]:
        """Extract LinkedIn URL from text"""
        pattern = r'linkedin\.com/in/[\w-]+'
        match = re.search(pattern, text, re.IGNORECASE)
        return f"https://{match.group(0)}" if match else None
    
    def _extract_website(self, text: str) -> Optional[str]:
        """Extract website URL from text"""
        pattern = r'https?://(?!linkedin)[\w\.-]+\.\w+'
        match = re.search(pattern, text, re.IGNORECASE)
        return match.group(0) if match else None
    
    def _parse_experience(self, text: str) -> List[ParsedExperience]:
        """Parse work experience section"""
        # Simplified parsing - in production use more sophisticated NER
        experiences = []
        lines = text.split('\n')
        
        current_exp = None
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Look for job title patterns
            if any(keyword in line.lower() for keyword in ['engineer', 'developer', 'manager', 'analyst', 'designer', 'specialist']):
                if current_exp:
                    experiences.append(current_exp)
                current_exp = ParsedExperience(
                    title=line,
                    company='',
                    description=''
                )
            elif current_exp and not current_exp.company:
                current_exp.company = line
            elif current_exp:
                current_exp.description += ' ' + line
        
        if current_exp:
            experiences.append(current_exp)
        
        return experiences
    
    def _parse_education(self, text: str) -> List[ParsedEducation]:
        """Parse education section"""
        education = []
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Look for degree patterns
            if any(keyword in line.lower() for keyword in ['bachelor', 'master', 'phd', 'b.s', 'm.s', 'mba', 'degree']):
                education.append(ParsedEducation(
                    degree=line,
                    institution=''
                ))
            elif education and not education[-1].institution:
                education[-1].institution = line
        
        return education
    
    def _calculate_experience_years(self, experiences: List[ParsedExperience]) -> float:
        """Calculate total years of experience"""
        # Simplified calculation
        return len(experiences) * 2.0  # Rough estimate
