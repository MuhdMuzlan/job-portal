import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authMiddleware, roleMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// All admin routes require admin role
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// User management
router.get('/users', (req: AuthRequest, res) => {
  adminController.getUsers(req, res);
});

router.put('/users/:id', (req: AuthRequest, res) => {
  adminController.updateUser(req, res);
});

router.delete('/users/:id', (req: AuthRequest, res) => {
  adminController.deleteUser(req, res);
});

// Company management
router.get('/companies', (req: AuthRequest, res) => {
  adminController.getCompanies(req, res);
});

router.put('/companies/:id/verify', (req: AuthRequest, res) => {
  adminController.verifyCompany(req, res);
});

// Job moderation
router.get('/jobs', (req: AuthRequest, res) => {
  adminController.getJobs(req, res);
});

router.put('/jobs/:id/moderate', (req: AuthRequest, res) => {
  adminController.moderateJob(req, res);
});

// Analytics
router.get('/analytics', (req: AuthRequest, res) => {
  adminController.getAnalytics(req, res);
});

export default router;
