import express from 'express';
import { 
  getProducts, getProductByIdOrSlug, createProduct, 
  updateProduct, deleteProduct, getCategories, 
  getSubCategories, getBrands, createCategory,
  updateCategory, deleteCategory
} from '../controllers/product.controller.js';
import { authenticate, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/subcategories', getSubCategories);
router.get('/brands', getBrands);
router.get('/:idOrSlug', getProductByIdOrSlug);

// Admin-only routes
router.post('/', authenticate, restrictTo('super_admin', 'product_manager'), createProduct);
router.put('/:id', authenticate, restrictTo('super_admin', 'product_manager'), updateProduct);
router.delete('/:id', authenticate, restrictTo('super_admin'), deleteProduct);

// Category Admin CRUD routes
router.post('/categories', authenticate, restrictTo('super_admin', 'product_manager'), createCategory);
router.put('/categories/:id', authenticate, restrictTo('super_admin', 'product_manager'), updateCategory);
router.delete('/categories/:id', authenticate, restrictTo('super_admin'), deleteCategory);

export default router;
