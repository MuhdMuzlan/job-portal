"""Embedding generation routes"""

from fastapi import APIRouter, HTTPException
from typing import List
import logging

from src.models.common import EmbeddingRequest, EmbeddingResponse
from src.services.embedding.generator import EmbeddingGenerator

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize embedding generator
embedding_generator = EmbeddingGenerator()


@router.post("/generate-embedding", response_model=EmbeddingResponse)
async def generate_embedding(request: EmbeddingRequest):
    """
    Generate embedding vector for text
    
    Used for:
    - Resume embeddings
    - Job description embeddings
    """
    try:
        logger.info(f"Generating embedding for text (length: {len(request.text)})")
        
        embedding = await embedding_generator.generate(request.text)
        
        return EmbeddingResponse(
            success=True,
            data={
                "embedding": embedding,
                "dimensions": len(embedding)
            }
        )
    except Exception as e:
        logger.error(f"Error generating embedding: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/batch-embeddings")
async def batch_generate_embeddings(texts: List[str]):
    """
    Generate embeddings for multiple texts
    """
    try:
        embeddings = await embedding_generator.batch_generate(texts)
        
        return {
            "success": True,
            "data": {
                "embeddings": embeddings,
                "count": len(embeddings)
            }
        }
    except Exception as e:
        logger.error(f"Error in batch embedding generation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/similarity")
async def calculate_similarity(
    embedding1: List[float],
    embedding2: List[float]
):
    """
    Calculate cosine similarity between two embeddings
    """
    try:
        similarity = embedding_generator.cosine_similarity(embedding1, embedding2)
        
        return {
            "success": True,
            "data": {
                "similarity": similarity
            }
        }
    except Exception as e:
        logger.error(f"Error calculating similarity: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
