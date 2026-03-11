import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import jobsRoutes from './jobs.routes';
import companiesRoutes from './companies.routes';
import applicationsRoutes from './applications.routes';
import adminRoutes from './admin.routes';
import matchingRoutes from './matching.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/jobs', jobsRoutes);
router.use('/companies', companiesRoutes);
router.use('/applications', applicationsRoutes);
router.use('/admin', adminRoutes);
router.use('/matching', matchingRoutes);

export default router;
