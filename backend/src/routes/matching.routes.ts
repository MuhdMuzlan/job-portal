import { Router } from 'express';
import { matchingController } from '../controllers/matching.controller';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// All matching routes require authentication
router.use(authMiddleware);

// Get job recommendations for current user
router.get('/recommendations', (req: AuthRequest, res) => {
  matchingController.getRecommendations(req, res);
});

// Calculate match score for specific job
router.post('/calculate', (req: AuthRequest, res) => {
  matchingController.calculateMatch(req, res);
});

// Parse resume (calls ML service)
router.post('/parse-resume', (req: AuthRequest, res) => {
  matchingController.parseResume(req, res);
});

export default router;
