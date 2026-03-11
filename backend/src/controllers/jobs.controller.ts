import { Request, Response } from 'express';
import { jobsService } from '../services/jobs.service';
import { applicationService } from '../services/application.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

export const jobsController = {
  async getJobs(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        location,
        jobType,
        experienceLevel,
        salaryMin,
        salaryMax,
        skills,
      } = req.query;

      const filters = {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        search: search as string,
        location: location as string,
        jobType: jobType as string,
        experienceLevel: experienceLevel as string,
        salaryMin: salaryMin ? parseInt(salaryMin as string, 10) : undefined,
        salaryMax: salaryMax ? parseInt(salaryMax as string, 10) : undefined,
        skills: skills ? (skills as string).split(',') : undefined,
      };

      const result = await jobsService.findAll(filters);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Get jobs error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch jobs' });
    }
  },

  async getJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const job = await jobsService.findById(id);
      
      if (!job) {
        throw new AppError('Job not found', 404);
      }

      res.json({ success: true, data: job });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: 'Failed to fetch job' });
      }
    }
  },

  async createJob(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const jobData = {
        ...req.body,
        companyId: userId, // In a real app, get company ID from user
      };

      const job = await jobsService.create(jobData);
      res.status(201).json({ success: true, data: job });
    } catch (error) {
      console.error('Create job error:', error);
      res.status(500).json({ success: false, error: 'Failed to create job' });
    }
  },

  async updateJob(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const job = await jobsService.findById(id);
      if (!job) {
        throw new AppError('Job not found', 404);
      }

      // Check ownership (in real app, compare with company ID)
      const updatedJob = await jobsService.update(id, req.body);
      res.json({ success: true, data: updatedJob });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: 'Failed to update job' });
      }
    }
  },

  async deleteJob(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await jobsService.delete(id);
      res.json({ success: true, message: 'Job deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete job' });
    }
  },

  async applyToJob(req: AuthRequest, res: Response) {
    try {
      const { id: jobId } = req.params;
      const { resumeId, coverLetter } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      // Check if job exists
      const job = await jobsService.findById(jobId);
      if (!job) {
        throw new AppError('Job not found', 404);
      }

      // Check if already applied
      const existingApplication = await applicationService.findByUserAndJob(userId, jobId);
      if (existingApplication) {
        throw new AppError('Already applied to this job', 400);
      }

      // Create application
      const application = await applicationService.create({
        userId,
        jobId,
        resumeId,
        coverLetter,
      });

      res.status(201).json({ success: true, data: application });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: 'Failed to apply to job' });
      }
    }
  },

  async getApplicants(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const applicants = await applicationService.findByJob(id);
      res.json({ success: true, data: applicants });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch applicants' });
    }
  },
};
