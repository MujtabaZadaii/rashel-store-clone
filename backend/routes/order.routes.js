import express from 'express';
import { 
  createOrder, getOrders, getAllOrdersAdmin, 
  updateOrderStatus, validateCoupon 
} from '../controllers/order.controller.js';
import { authenticate, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// User authenticated routes
router.post('/', authenticate, createOrder);
router.get('/', authenticate, getOrders);
router.post('/validate-coupon', authenticate, validateCoupon);

// Admin-only routes
router.get('/admin', authenticate, restrictTo('super_admin', 'order_manager'), getAllOrdersAdmin);
router.put('/:id/status', authenticate, restrictTo('super_admin', 'order_manager'), updateOrderStatus);

export default router;
