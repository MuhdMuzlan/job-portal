"""Resume section splitter"""

import re
from typing import Dict, List


class SectionSplitter:
    """Split resume text into sections"""
    
    # Common section headers
    SECTION_HEADERS = {
        'summary': ['summary', 'profile', 'objective', 'about me', 'professional summary'],
        'experience': ['experience', 'work experience', 'employment', 'professional experience', 'work history'],
        'education': ['education', 'academic background', 'qualifications'],
        'skills': ['skills', 'technical skills', 'competencies', 'expertise'],
        'projects': ['projects', 'personal projects', 'key projects'],
        'certifications': ['certifications', 'certificates', 'professional development'],
        'languages': ['languages', 'language skills'],
        'interests': ['interests', 'hobbies', 'activities'],
    }
    
    def split(self, text: str) -> Dict[str, str]:
        """
        Split resume text into sections
        
        Args:
            text: Full resume text
            
        Returns:
            Dictionary of section name -> section content
        """
        sections = {}
        
        # Normalize text
        text = text.strip()
        
        # Split by lines
        lines = text.split('\n')
        
        current_section = 'header'
        current_content = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Check if this line is a section header
            section_name = self._identify_section(line)
            
            if section_name:
                # Save previous section
                if current_content:
                    sections[current_section] = '\n'.join(current_content)
                
                current_section = section_name
                current_content = []
            else:
                current_content.append(line)
        
        # Save last section
        if current_content:
            sections[current_section] = '\n'.join(current_content)
        
        return sections
    
    def _identify_section(self, line: str) -> str:
        """Identify if line is a section header"""
        line_lower = line.lower().strip()
        
        # Remove common characters
        line_clean = re.sub(r'[:\-\s]+', '', line_lower)
        
        # Check each section type
        for section_name, headers in self.SECTION_HEADERS.items():
            for header in headers:
                header_clean = re.sub(r'[:\-\s]+', '', header)
                if line_clean == header_clean or line_clean.startswith(header_clean):
                    return section_name
        
        return ''
