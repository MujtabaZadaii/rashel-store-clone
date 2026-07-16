import express from 'express';
import { createReview, getReviews } from '../controllers/review.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/:productId', getReviews);
router.post('/', authenticate, createReview);

export default router;
