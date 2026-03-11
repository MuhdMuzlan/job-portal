import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import { jobsService } from '../services/jobs.service';
import { applicationService } from '../services/application.service';

const prisma = new PrismaClient();

export const companiesController = {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const company = await prisma.company.findUnique({
        where: { userId },
      });

      if (!company) {
        throw new AppError('Company not found', 404);
      }

      res.json({ success: true, data: company });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: 'Failed to get company profile' });
      }
    }
  },

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const company = await prisma.company.update({
        where: { userId },
        data: req.body,
      });

      res.json({ success: true, data: company });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update company profile' });
    }
  },

  async getJobs(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      // Get company ID from user
      const company = await prisma.company.findUnique({
        where: { userId },
      });

      if (!company) {
        throw new AppError('Company not found', 404);
      }

      const jobs = await jobsService.findByCompany(company.id);
      res.json({ success: true, data: jobs });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: 'Failed to fetch jobs' });
      }
    }
  },

  async getApplicants(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      // Get company's jobs first
      const company = await prisma.company.findUnique({
        where: { userId },
        include: {
          jobs: {
            select: { id: true },
          },
        },
      });

      if (!company) {
        throw new AppError('Company not found', 404);
      }

      // Get all applications for company's jobs
      const jobIds = company.jobs.map((j) => j.id);
      const applications = await prisma.application.findMany({
        where: { jobId: { in: jobIds } },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              headline: true,
            },
          },
          job: {
            select: {
              id: true,
              title: true,
            },
          },
          resume: true,
        },
        orderBy: { appliedAt: 'desc' },
      });

      res.json({ success: true, data: applications });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: 'Failed to fetch applicants' });
      }
    }
  },
};
