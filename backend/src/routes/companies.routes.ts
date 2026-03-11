import { Router } from 'express';
import { companiesController } from '../controllers/companies.controller';
import { authMiddleware, roleMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Get company profile
router.get('/profile', authMiddleware, roleMiddleware('company'), (req: AuthRequest, res) => {
  companiesController.getProfile(req, res);
});

// Update company profile
router.put('/profile', authMiddleware, roleMiddleware('company'), (req: AuthRequest, res) => {
  companiesController.updateProfile(req, res);
});

// Get company's jobs
router.get('/jobs', authMiddleware, roleMiddleware('company'), (req: AuthRequest, res) => {
  companiesController.getJobs(req, res);
});

// Get all applicants for company's jobs
router.get('/applicants', authMiddleware, roleMiddleware('company'), (req: AuthRequest, res) => {
  companiesController.getApplicants(req, res);
});

export default router;
