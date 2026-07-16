import express from 'express';
import { 
  getBlogs, getBlogBySlug, createBlog, 
  getBlogCategories, addBlogComment 
} from '../controllers/blog.controller.js';
import { authenticate, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/categories', getBlogCategories);
router.get('/:slug', getBlogBySlug);
router.post('/comments', addBlogComment);

// Admin-only route
router.post('/', authenticate, restrictTo('super_admin', 'content_manager'), createBlog);

export default router;
