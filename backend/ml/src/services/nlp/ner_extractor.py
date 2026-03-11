"""Named Entity Recognition extractor"""

import logging
from typing import Dict, Any, Optional
import re

logger = logging.getLogger(__name__)


class NERExtractor:
    """Extract named entities from text"""
    
    def __init__(self):
        # Try to load spaCy model if available
        self.nlp = None
        self._load_model()
    
    def _load_model(self):
        """Load spaCy model"""
        try:
            import spacy
            self.nlp = spacy.load("en_core_web_sm")
            logger.info("Loaded spaCy model: en_core_web_sm")
        except Exception as e:
            logger.warning(f"Could not load spaCy model: {e}")
            logger.warning("Using regex-based extraction instead")
    
    async def extract(self, text: str) -> Dict[str, Any]:
        """
        Extract named entities from text
        
        Args:
            text: Text to extract entities from
            
        Returns:
            Dictionary of entity type -> entity value
        """
        entities = {}
        
        if self.nlp:
            # Use spaCy for NER
            doc = self.nlp(text[:5000])  # Limit text length
            
            # Extract name (first PERSON entity)
            for ent in doc.ents:
                if ent.label_ == 'PERSON' and 'name' not in entities:
                    entities['name'] = ent.text
                
                elif ent.label_ == 'GPE' and 'location' not in entities:
                    entities['location'] = ent.text
                
                elif ent.label_ == 'ORG':
                    if 'organizations' not in entities:
                        entities['organizations'] = []
                    entities['organizations'].append(ent.text)
                
                elif ent.label_ == 'DATE':
                    if 'dates' not in entities:
                        entities['dates'] = []
                    entities['dates'].append(ent.text)
        else:
            # Fallback to regex-based extraction
            entities = self._regex_extract(text)
        
        return entities
    
    def _regex_extract(self, text: str) -> Dict[str, Any]:
        """Extract entities using regex patterns"""
        entities = {}
        
        # Extract name (usually at the beginning of resume)
        first_lines = text.split('\n')[:5]
        for line in first_lines:
            line = line.strip()
            if line and len(line.split()) <= 4 and not any(c in line for c in ['@', '(', '|']):
                # Likely a name
                if re.match(r'^[A-Z][a-z]+ [A-Z][a-z]+$', line):
                    entities['name'] = line
                    break
        
        # Extract location patterns
        location_patterns = [
            r'([A-Z][a-z]+(?:,\s*|\s+)[A-Z]{2})\s*\d{0,5}',  # City, ST
            r'([A-Z][a-z]+(?:,\s*|\s+)[A-Z][a-z]+)',  # City, State
        ]
        for pattern in location_patterns:
            match = re.search(pattern, text)
            if match:
                entities['location'] = match.group(1)
                break
        
        return entities
