import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { resumeService } from '../services/resume.service';
import { applicationService } from '../services/application.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

export const usersController = {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const user = await userService.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          location: user.location,
          headline: user.headline,
          summary: user.summary,
          skills: user.skills,
          experienceYears: user.experienceYears,
          company: user.company,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: 'Failed to get profile' });
      }
    }
  },

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const user = await userService.update(userId, req.body);
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
  },

  async getResumes(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const resumes = await resumeService.findByUser(userId);
      res.json({ success: true, data: resumes });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch resumes' });
    }
  },

  async uploadResume(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      // In a real app, handle file upload to S3/MinIO
      // Then call ML service for parsing
      const { fileUrl, fileName, parsedText, parsedSkills } = req.body;

      const resume = await resumeService.create({
        userId,
        fileUrl,
        fileName,
        parsedText,
        parsedSkills,
      });

      res.status(201).json({ success: true, data: resume });
    } catch (error) {
      console.error('Upload resume error:', error);
      res.status(500).json({ success: false, error: 'Failed to upload resume' });
    }
  },

  async deleteResume(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const resume = await resumeService.findById(id);
      if (!resume || resume.userId !== userId) {
        throw new AppError('Resume not found', 404);
      }

      await resumeService.delete(id);
      res.json({ success: true, message: 'Resume deleted successfully' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: 'Failed to delete resume' });
      }
    }
  },

  async getApplications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const applications = await applicationService.findByUser(userId);
      res.json({ success: true, data: applications });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch applications' });
    }
  },
};
