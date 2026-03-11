"""PDF text extractor"""

import logging
from typing import Optional
import pdfplumber

logger = logging.getLogger(__name__)


class PDFExtractor:
    """Extract text from PDF files"""
    
    async def extract(self, content: bytes) -> str:
        """
        Extract text from PDF content
        
        Args:
            content: PDF file bytes
            
        Returns:
            Extracted text
        """
        try:
            import io
            
            # Create a file-like object
            pdf_file = io.BytesIO(content)
            
            text_parts = []
            
            with pdfplumber.open(pdf_file) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
            
            full_text = '\n\n'.join(text_parts)
            
            # Clean up text
            full_text = self._clean_text(full_text)
            
            return full_text
            
        except Exception as e:
            logger.error(f"Error extracting PDF text: {str(e)}")
            raise
    
    def _clean_text(self, text: str) -> str:
        """Clean extracted text"""
        # Remove excessive whitespace
        import re
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters that might be artifacts
        text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)
        
        return text.strip()
