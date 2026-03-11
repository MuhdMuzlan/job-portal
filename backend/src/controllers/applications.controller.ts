import { Request, Response } from 'express';
import { applicationService } from '../services/application.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

export const applicationsController = {
  async getUserApplications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const applications = await applicationService.findByUser(userId);
      res.json({ success: true, data: applications });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: 'Failed to fetch applications' });
      }
    }
  },

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['pending', 'reviewing', 'interview', 'offered', 'rejected'];
      if (!validStatuses.includes(status)) {
        throw new AppError('Invalid status', 400);
      }

      const application = await applicationService.updateStatus(id, status);
      res.json({ success: true, data: application });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: 'Failed to update application status' });
      }
    }
  },
};
