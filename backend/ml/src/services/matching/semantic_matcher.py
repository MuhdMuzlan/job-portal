"""Semantic similarity matching using embeddings"""

import logging
from typing import List
import numpy as np

logger = logging.getLogger(__name__)


class SemanticMatcher:
    """Match using semantic similarity of embeddings"""
    
    def __init__(self, similarity_threshold: float = 0.5):
        self.similarity_threshold = similarity_threshold
    
    async def match(
        self,
        resume_embedding: List[float],
        job_embedding: List[float]
    ) -> float:
        """
        Calculate semantic similarity score
        
        Args:
            resume_embedding: Resume embedding vector
            job_embedding: Job embedding vector
            
        Returns:
            Similarity score between 0 and 1
        """
        if not resume_embedding or not job_embedding:
            # If no embeddings available, return neutral score
            return 0.5
        
        if len(resume_embedding) != len(job_embedding):
            logger.warning("Embedding dimensions don't match")
            return 0.5
        
        # Calculate cosine similarity
        similarity = self._cosine_similarity(resume_embedding, job_embedding)
        
        # Normalize to 0-1 range (cosine similarity is -1 to 1)
        normalized = (similarity + 1) / 2
        
        return normalized
    
    def _cosine_similarity(
        self,
        vec1: List[float],
        vec2: List[float]
    ) -> float:
        """Calculate cosine similarity between two vectors"""
        vec1_np = np.array(vec1)
        vec2_np = np.array(vec2)
        
        dot_product = np.dot(vec1_np, vec2_np)
        norm1 = np.linalg.norm(vec1_np)
        norm2 = np.linalg.norm(vec2_np)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return float(dot_product / (norm1 * norm2))
