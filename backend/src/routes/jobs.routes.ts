import { Router, Request, Response } from 'express';
import { query, body, validationResult } from 'express-validator';
import { jobsController } from '../controllers/jobs.controller';
import { authMiddleware, roleMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Get all jobs (public)
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString(),
    query('location').optional().isString(),
    query('jobType').optional().isIn(['full-time', 'part-time', 'contract', 'remote', 'hybrid']),
    query('experienceLevel').optional().isIn(['entry', 'mid', 'senior', 'lead', 'executive']),
  ],
  async (req: Request, res: Response) => {
    await jobsController.getJobs(req, res);
  }
);

// Get job by ID (public)
router.get('/:id', async (req: Request, res: Response) => {
  await jobsController.getJob(req, res);
});

// Create job (company only)
router.post(
  '/',
  authMiddleware,
  roleMiddleware('company'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('jobType').isIn(['full-time', 'part-time', 'contract', 'remote', 'hybrid']),
    body('experienceLevel').isIn(['entry', 'mid', 'senior', 'lead', 'executive']),
    body('skillsRequired').isArray().withMessage('Skills must be an array'),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    await jobsController.createJob(req, res);
  }
);

// Update job (company only)
router.put('/:id', authMiddleware, roleMiddleware('company'), async (req: AuthRequest, res: Response) => {
  await jobsController.updateJob(req, res);
});

// Delete job (company only)
router.delete('/:id', authMiddleware, roleMiddleware('company'), async (req: AuthRequest, res: Response) => {
  await jobsController.deleteJob(req, res);
});

// Apply to job (user only)
router.post(
  '/:id/apply',
  authMiddleware,
  roleMiddleware('user'),
  [body('resumeId').notEmpty().withMessage('Resume ID is required')],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    await jobsController.applyToJob(req, res);
  }
);

// Get applicants for job (company only)
router.get('/:id/applicants', authMiddleware, roleMiddleware('company'), async (req: AuthRequest, res: Response) => {
  await jobsController.getApplicants(req, res);
});

export default router;
