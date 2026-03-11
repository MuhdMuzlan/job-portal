import { Router } from 'express';
import { applicationsController } from '../controllers/applications.controller';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// All application routes require authentication
router.use(authMiddleware);

// Get applications for current user
router.get('/', (req: AuthRequest, res) => {
  applicationsController.getUserApplications(req, res);
});

// Update application status (for companies)
router.put('/:id/status', (req: AuthRequest, res) => {
  applicationsController.updateStatus(req, res);
});

export default router;
