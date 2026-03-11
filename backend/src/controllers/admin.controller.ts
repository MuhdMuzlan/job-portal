import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import { userService } from '../services/user.service';

const prisma = new PrismaClient();

export const adminController = {
  async getUsers(req: AuthRequest, res: Response) {
    try {
      const { page = 1, limit = 10, role, search } = req.query;

      const where: any = {};
      if (role) {
        where.role = role;
      }
      if (search) {
        where.OR = [
          { email: { contains: search as string, mode: 'insensitive' } },
          { firstName: { contains: search as string, mode: 'insensitive' } },
          { lastName: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const skip = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: parseInt(limit as string, 10),
          select: {
            id: true,
            email: true,
            role: true,
            firstName: true,
            lastName: true,
            isVerified: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          data: users,
          total,
          page: parseInt(page as string, 10),
          limit: parseInt(limit as string, 10),
          totalPages: Math.ceil(total / parseInt(limit as string, 10)),
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
  },

  async updateUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.update({
        where: { id },
        data: req.body,
      });
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update user' });
    }
  },

  async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await userService.delete(id);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete user' });
    }
  },

  async getCompanies(req: AuthRequest, res: Response) {
    try {
      const { page = 1, limit = 10, isVerified } = req.query;

      const where: any = {};
      if (isVerified !== undefined) {
        where.isVerified = isVerified === 'true';
      }

      const skip = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);

      const [companies, total] = await Promise.all([
        prisma.company.findMany({
          where,
          skip,
          take: parseInt(limit as string, 10),
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.company.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          data: companies,
          total,
          page: parseInt(page as string, 10),
          limit: parseInt(limit as string, 10),
          totalPages: Math.ceil(total / parseInt(limit as string, 10)),
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch companies' });
    }
  },

  async verifyCompany(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { isVerified } = req.body;

      const company = await prisma.company.update({
        where: { id },
        data: { isVerified },
      });

      res.json({ success: true, data: company });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to verify company' });
    }
  },

  async getJobs(req: AuthRequest, res: Response) {
    try {
      const { page = 1, limit = 10, status } = req.query;

      const where: any = {};
      if (status) {
        where.status = status;
      }

      const skip = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);

      const [jobs, total] = await Promise.all([
        prisma.job.findMany({
          where,
          skip,
          take: parseInt(limit as string, 10),
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.job.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          data: jobs,
          total,
          page: parseInt(page as string, 10),
          limit: parseInt(limit as string, 10),
          totalPages: Math.ceil(total / parseInt(limit as string, 10)),
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch jobs' });
    }
  },

  async moderateJob(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;

      const job = await prisma.job.update({
        where: { id },
        data: { status },
      });

      res.json({ success: true, data: job });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to moderate job' });
    }
  },

  async getAnalytics(req: AuthRequest, res: Response) {
    try {
      const [
        totalUsers,
        totalCompanies,
        totalJobs,
        totalApplications,
        activeJobs,
        pendingCompanies,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.company.count(),
        prisma.job.count(),
        prisma.application.count(),
        prisma.job.count({ where: { status: 'active' } }),
        prisma.company.count({ where: { isVerified: false } }),
      ]);

      // Applications by status
      const applicationsByStatus = await prisma.application.groupBy({
        by: ['status'],
        _count: true,
      });

      // Jobs by type
      const jobsByType = await prisma.job.groupBy({
        by: ['jobType'],
        _count: true,
      });

      // Users by role
      const usersByRole = await prisma.user.groupBy({
        by: ['role'],
        _count: true,
      });

      res.json({
        success: true,
        data: {
          overview: {
            totalUsers,
            totalCompanies,
            totalJobs,
            totalApplications,
            activeJobs,
            pendingCompanies,
          },
          applicationsByStatus,
          jobsByType,
          usersByRole,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
    }
  },
};
