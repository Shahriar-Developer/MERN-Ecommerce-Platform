import { Router } from 'express';
import { getDashboardStats, getPreOrderStatus } from '../controllers/dashboardController';
import { protect, admin } from '../middleware/authMiddleware';
const router = Router();
router.get('/stats', protect, admin, getDashboardStats);
router.get('/pre-orders', protect, admin, getPreOrderStatus);
export default router;
