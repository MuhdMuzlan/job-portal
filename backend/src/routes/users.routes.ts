import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { usersController } from '../controllers/users.controller';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Get user profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  await usersController.getProfile(req, res);
});

// Update user profile
router.put(
  '/profile',
  authMiddleware,
  [
    body('firstName').optional().isString(),
    body('lastName').optional().isString(),
    body('phone').optional().isString(),
    body('location').optional().isString(),
    body('headline').optional().isString(),
    body('summary').optional().isString(),
    body('skills').optional().isArray(),
    body('experienceYears').optional().isInt({ min: 0 }),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    await usersController.updateProfile(req, res);
  }
);

// Get user resumes
router.get('/resumes', authMiddleware, async (req: AuthRequest, res: Response) => {
  await usersController.getResumes(req, res);
});

// Upload resume
router.post('/resumes', authMiddleware, async (req: AuthRequest, res: Response) => {
  await usersController.uploadResume(req, res);
});

// Delete resume
router.delete('/resumes/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  await usersController.deleteResume(req, res);
});

// Get user applications
router.get('/applications', authMiddleware, async (req: AuthRequest, res: Response) => {
  await usersController.getApplications(req, res);
});

export default router;
