import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer storage for admin uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

import { 
  getBannersAndSliders, getFAQs, getSettings, 
  getStoreLocations, subscribeNewsletter,
  getAddresses, addAddress, deleteAddress,
  getWishlist, addToWishlist, removeFromWishlist,
  getSEOMetadata,
  getBannersAndSlidersAdmin, createSlider, updateSlider, deleteSlider,
  createBanner, updateBanner, deleteBanner,
  getShopByCategories, createShopByCategory, updateShopByCategory, deleteShopByCategory
} from '../controllers/general.controller.js';
import { authenticate, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public General routes
router.get('/promos', getBannersAndSliders);
router.get('/faqs', getFAQs);
router.get('/settings', getSettings);
router.get('/stores', getStoreLocations);
router.post('/newsletter', subscribeNewsletter);
router.get('/seo', getSEOMetadata);
router.get('/shop-by-categories', getShopByCategories);

// User Authenticated Address routes
router.get('/addresses', authenticate, getAddresses);
router.post('/addresses', authenticate, addAddress);
router.delete('/addresses/:id', authenticate, deleteAddress);

// User Authenticated Wishlist routes
router.get('/wishlist', authenticate, getWishlist);
router.post('/wishlist', authenticate, addToWishlist);
router.delete('/wishlist/:productId', authenticate, removeFromWishlist);

// Admin-only Promos/Banners/Sliders management routes
router.get('/promos/admin', authenticate, restrictTo('super_admin', 'content_manager'), getBannersAndSlidersAdmin);
router.post('/sliders', authenticate, restrictTo('super_admin', 'content_manager'), createSlider);
router.put('/sliders/:id', authenticate, restrictTo('super_admin', 'content_manager'), updateSlider);
router.delete('/sliders/:id', authenticate, restrictTo('super_admin'), deleteSlider);
router.post('/banners', authenticate, restrictTo('super_admin', 'content_manager'), createBanner);
router.put('/banners/:id', authenticate, restrictTo('super_admin', 'content_manager'), updateBanner);
router.delete('/banners/:id', authenticate, restrictTo('super_admin'), deleteBanner);

// Admin-only Shop By Categories routes
router.post('/shop-by-categories', authenticate, restrictTo('super_admin', 'content_manager'), createShopByCategory);
router.put('/shop-by-categories/:id', authenticate, restrictTo('super_admin', 'content_manager'), updateShopByCategory);
router.delete('/shop-by-categories/:id', authenticate, restrictTo('super_admin'), deleteShopByCategory);

// Admin-only Upload route
router.post('/upload', authenticate, restrictTo('super_admin', 'content_manager'), upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    return res.json({ success: true, imageUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'File upload failed.' });
  }
});

export default router;
