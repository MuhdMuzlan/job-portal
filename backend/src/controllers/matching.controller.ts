import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

// ML Service client
async function callMLService(endpoint: string, data: any) {
  const response = await fetch(`${config.mlServiceUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`ML service error: ${response.statusText}`);
  }

  return response.json();
}

export const matchingController = {
  async getRecommendations(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const { resumeId, limit = 10 } = req.query;

      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      // Get user's primary resume if not specified
      let resume;
      if (resumeId) {
        resume = await prisma.resume.findUnique({
          where: { id: resumeId as string },
        });
      } else {
        resume = await prisma.resume.findFirst({
          where: { userId, isPrimary: true },
        });
      }

      if (!resume) {
        throw new AppError('No resume found. Please upload a resume first.', 404);
      }

      // Check for cached matches
      const cachedMatches = await prisma.jobMatch.findMany({
        where: { resumeId: resume.id },
        include: {
          job: {
            include: {
              company: true,
            },
          },
        },
        orderBy: { matchScore: 'desc' },
        take: parseInt(limit as string, 10),
      });

      // If cached matches exist and are recent (less than 24 hours old), return them
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const hasRecentMatches = cachedMatches.length > 0 && 
        new Date(cachedMatches[0].calculatedAt) > oneDayAgo;

      if (hasRecentMatches) {
        return res.json({ success: true, data: cachedMatches });
      }

      // Otherwise, call ML service for new matches
      const matches = await callMLService('/api/v1/matching/recommendations', {
        resume_id: resume.id,
        limit: parseInt(limit as string, 10),
      });

      // Cache the new matches
      if (matches.data && matches.data.length > 0) {
        // Delete old matches
        await prisma.jobMatch.deleteMany({
          where: { resumeId: resume.id },
        });

        // Create new matches
        await prisma.jobMatch.createMany({
          data: matches.data.map((m: any) => ({
            resumeId: resume.id,
            jobId: m.job_id,
            matchScore: m.match_score,
            skillMatchScore: m.skill_match_score,
            experienceMatchScore: m.experience_match_score,
            semanticMatchScore: m.semantic_match_score,
            matchReasons: m.match_reasons,
          })),
        });
      }

      res.json(matches);
    } catch (error) {
      console.error('Get recommendations error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: 'Failed to get recommendations' });
      }
    }
  },

  async calculateMatch(req: AuthRequest, res: Response) {
    try {
      const { resumeId, jobId } = req.body;

      if (!resumeId || !jobId) {
        throw new AppError('Resume ID and Job ID are required', 400);
      }

      const match = await callMLService('/api/v1/matching/calculate', {
        resume_id: resumeId,
        job_id: jobId,
      });

      res.json(match);
    } catch (error) {
      console.error('Calculate match error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: 'Failed to calculate match' });
      }
    }
  },

  async parseResume(req: AuthRequest, res: Response) {
    try {
      const { fileUrl } = req.body;

      if (!fileUrl) {
        throw new AppError('File URL is required', 400);
      }

      const result = await callMLService('/api/v1/parse-resume', {
        file_url: fileUrl,
      });

      res.json(result);
    } catch (error) {
      console.error('Parse resume error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: 'Failed to parse resume' });
      }
    }
  },
};
