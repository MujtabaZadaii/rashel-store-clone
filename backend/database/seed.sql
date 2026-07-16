-- Seed Data for VIP Rashel Skincare Store
USE rashel_store;

-- Clear existing data (in reverse dependency order)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE settings;
TRUNCATE TABLE seo_pages;
TRUNCATE TABLE store_locations;
TRUNCATE TABLE newsletter_subscribers;
TRUNCATE TABLE notifications;
TRUNCATE TABLE faqs;
TRUNCATE TABLE blog_comments;
TRUNCATE TABLE blogs;
TRUNCATE TABLE blog_categories;
TRUNCATE TABLE testimonials;
TRUNCATE TABLE sliders;
TRUNCATE TABLE banners;
TRUNCATE TABLE transactions;
TRUNCATE TABLE payments;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE coupon_usage;
TRUNCATE TABLE coupons;
TRUNCATE TABLE addresses;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE carts;
TRUNCATE TABLE wishlists;
TRUNCATE TABLE product_tags;
TRUNCATE TABLE product_variant_images;
TRUNCATE TABLE product_variants;
TRUNCATE TABLE products;
TRUNCATE TABLE brands;
TRUNCATE TABLE sub_categories;
TRUNCATE TABLE categories;
TRUNCATE TABLE email_verifications;
TRUNCATE TABLE password_resets;
TRUNCATE TABLE refresh_tokens;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Seed Users (password123 for all)
-- Password Hash: $2a$10$zR3kK06uRzO9mGvG/9aW7unP18sUvD/9Ua4r1hP4FqTzO3tM2ZJ6q (password123)
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Super Admin', 'admin@rashel.in', '$2a$10$zR3kK06uRzO9mGvG/9aW7unP18sUvD/9Ua4r1hP4FqTzO3tM2ZJ6q', 'super_admin'),
(2, 'Product Manager', 'products@rashel.in', '$2a$10$zR3kK06uRzO9mGvG/9aW7unP18sUvD/9Ua4r1hP4FqTzO3tM2ZJ6q', 'product_manager'),
(3, 'Order Manager', 'orders@rashel.in', '$2a$10$zR3kK06uRzO9mGvG/9aW7unP18sUvD/9Ua4r1hP4FqTzO3tM2ZJ6q', 'order_manager'),
(4, 'Support Staff', 'support@rashel.in', '$2a$10$zR3kK06uRzO9mGvG/9aW7unP18sUvD/9Ua4r1hP4FqTzO3tM2ZJ6q', 'support_staff'),
(5, 'Regular Customer', 'customer@gmail.com', '$2a$10$zR3kK06uRzO9mGvG/9aW7unP18sUvD/9Ua4r1hP4FqTzO3tM2ZJ6q', 'user');

-- 2. Seed Categories
INSERT INTO categories (id, name, slug, image_url) VALUES
(1, 'Face Care', 'face-care', 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=300&auto=format&fit=crop'),
(2, 'Body & Bath', 'body-bath', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=300&auto=format&fit=crop'),
(3, 'Hair Care', 'hair-care', 'https://images.unsplash.com/photo-1527799822341-47100b3d6585?q=80&w=300&auto=format&fit=crop'),
(4, 'Offers', 'offers', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=300&auto=format&fit=crop'),
(5, 'Scrub', 'scrub', '/Shop_By_Category/shop_by_category_summer_theme-02_jpg.png'),
(6, 'Face wash', 'face-wash', '/Shop_By_Category/shop_by_category_summer_theme-03_jpg.png'),
(7, 'Sunscreen', 'sunscreen', '/Shop_By_Category/shop_by_category_summer_theme-04_jpg.png'),
(8, 'Nose Strips', 'nose-strips', '/Shop_By_Category/shop_by_category_summer_theme-01.jpg_1.png'),
(9, 'K-Derma', 'k-derma', '/Range-08.png'),
(10, 'Shop Under 99', 'shop-under-99', '/Range.jpg_4.png');

-- 3. Seed Sub Categories
INSERT INTO sub_categories (id, category_id, name, slug) VALUES
(1, 1, 'Serums & Elixirs', 'serums-elixirs'),
(2, 1, 'Face Wash & Cleansers', 'face-wash-cleansers'),
(3, 1, 'Scrubs & Exfoliators', 'face-scrubs'),
(4, 1, 'Sunscreen & Protection', 'sunscreens'),
(5, 2, 'Body Scrubs', 'body-scrubs'),
(6, 2, 'Shower Gels', 'shower-gels'),
(7, 3, 'Shampoos', 'shampoos'),
(8, 3, 'Hair Oils & Serums', 'hair-serums');

-- 4. Seed Brands
INSERT INTO brands (id, name, slug, logo_url) VALUES
(1, 'Dr. Rashel', 'dr-rashel', 'https://dr.rashel.in/'),
(2, 'K-Derma', 'k-derma', 'https://dr.rashel.in/');

-- 5. Seed Products
INSERT INTO products (id, category_id, sub_category_id, brand_id, name, slug, description, benefits, ingredients, how_to_use, meta_title, meta_description, rating, status) VALUES
(1, 1, 1, 1, 'Rice Water Face Serum', 'rice-water-face-serum', 
 'Our premium Rice Water Face Serum is crafted with fermented rice extract and hyaluronic acid. It locks in moisture, shrinks pores, and builds a luminous glass skin appearance.', 
 'Brightens skin, reduces large pores, hydrates deeply, promotes glass skin look.', 
 'Fermented Rice Water extract, Niacinamide (5%), Hyaluronic Acid, Glycerin, Centella Asiatica.', 
 'Apply 3-4 drops to cleansed face and neck. Pat gently until fully absorbed. Follow with moisturizer.',
 'VIP Rice Water Face Serum - Dr. Rashel India', 'Buy Dr. Rashel Rice Water Face Serum for skin tightening and glow. Made with pure rice water essence.', 4.80, 'active'),

(2, 1, 2, 1, 'Vitamin C Face Wash', 'vitamin-c-face-wash', 
 'Formulated with advanced stable Vitamin C and Orange Peel extracts. It gently washes off impurities while bringing out a vibrant, spotless glow.', 
 'Reduces spots, removes tanning, boosts collagen, leaves skin refreshed.', 
 'Vitamin C (Ascorbic Acid), Aloe Vera juice, Orange extract, Tea Tree oil.', 
 'Squeeze small amount on palm, lather with water, massage face gently, rinse off completely.',
 'Vitamin C Glow Face Wash - Dr. Rashel Store', 'D-tan and glow face wash with rich orange extract and pure Vitamin C extracts.', 4.65, 'active'),

(3, 1, 3, 1, 'De-Tan Face & Body Scrub', 'de-tan-face-body-scrub', 
 'A rich, creamy exfoliator loaded with real walnut shell granules and botanical brightening oils. Perfect for tan removal and restoring natural glow.', 
 'Removes dead skin, fades tan instantly, softens dry patches, hydrates dry skin.', 
 'Walnut shell powder, Clove oil, Eucalyptus oil, Shea Butter.', 
 'Dampen skin. Massage scrub in circular motions for 2-3 minutes. Wash off with warm water.',
 'De-Tan Scrub with Clove & Walnut - VIP Skincare', 'Buy premium De-tan scrub for professional face & body exfoliating. Best price.', 4.90, 'active'),

(4, 1, 4, 1, 'Sunscreen Gel SPF 50 PA+++', 'sunscreen-gel-spf-50', 
 'Broad spectrum, ultra-lightweight, non-greasy sunscreen gel. Zero white cast, water-resistant formula suitable for all skin types.', 
 'Protects from UVA/UVB rays, non-comedogenic, controls oil, sweat-resistant.', 
 'Octyl Methoxycinnamate, Zinc Oxide, Aloe extract, Vitamin E.', 
 'Apply generously 15 minutes before stepping out in the sun. Reapply every 3 hours.',
 'Sunscreen Gel SPF 50 PA+++ - Non-Greasy & Zero White Cast', 'Order non-greasy broad spectrum sunscreen gel. Complete protection.', 4.75, 'active'),

(5, 3, 7, 1, 'Onion Hair Fall Control Shampoo', 'onion-hair-fall-shampoo', 
 'Fortified with Red Onion Seed Extract and Black Seed Oil. Cleanses scalp thoroughly, strengthens roots, and stops hair fall.', 
 'Controls hair fall, nourishes hair roots, makes hair smooth, stimulates growth.', 
 'Red Onion extract, Black seed extract, D-Panthenol, Keratin.', 
 'Apply on wet hair. Massage into lather. Leave for a minute. Rinse thoroughly.',
 'Onion Shampoo for Hair Growth & Fall Control', 'Best onion shampoo with pure extract. Restores hair vitality and controls hair fall.', 4.50, 'active'),

(6, 6, 2, 1, 'Vitamin C Cleansing Gel', 'vitamin-c-cleansing-gel',
 'Vitamin C Cleansing Gel hydrates and gently cleanses to restore a radiant, glowing face.',
 'Deep cleanses, moisturizes, boosts natural radiance.',
 'Vitamin C, Aloe Vera, Glycerin',
 'Apply on wet face, massage and rinse off with water.',
 'Vitamin C Cleansing Gel - Rashel Store', 'Vitamin C Cleansing Gel for glowing skin.', 4.80, 'active'),

(7, 1, 3, 1, 'Charcoal Blackhead Mask', 'charcoal-blackhead-mask',
 'Activated charcoal mask clears blackheads and purifies pores for smooth skin.',
 'Removes blackheads, controls excess sebum, purifies skin.',
 'Activated Charcoal, Clay, Witch Hazel',
 'Apply even layer on nose/face, let dry for 15 minutes, peel off gently.',
 'Charcoal Blackhead Mask - Rashel Store', 'Effective Charcoal Blackhead peel off mask.', 4.70, 'active'),

(8, 1, 1, 1, 'Gold Revitalizing Eye Gel', 'gold-revitalizing-eye-gel',
 'Infused with real gold flakes, this eye gel depuffs under-eyes and reduces dark circles.',
 'Reduces dark circles, depuffs under-eyes, hydrates skin.',
 'Real Gold Flakes, Hyaluronic Acid, Collagen',
 'Apply small dots under eyes, pat gently until absorbed.',
 'Gold Revitalizing Eye Gel - Rashel Store', 'Revitalizing under-eye gel with real gold.', 4.90, 'active'),

(9, 6, 2, 1, 'Salicylic Acid Clay Cleanser', 'salicylic-acid-clay-cleanser',
 'Salicylic Acid Clay Cleanser controls oil and breakouts while deeply exfoliating.',
 'Controls acne, deeply exfoliates, refines pores.',
 'Salicylic Acid (2%), Kaolin Clay, Tea Tree Oil',
 'Apply on wet face, lather, and rinse off.',
 'Salicylic Acid Clay Cleanser - Rashel Store', 'Acne control clay cleanser.', 4.60, 'active'),

(10, 1, 1, 1, 'Vitamin C Brightening Fluid', 'vitamin-c-brightening-fluid',
 'A lightweight brightening fluid with Vitamin C that hydrates and gives a glass skin glow.',
 'Brightens dull skin, provides intense hydration, non-sticky.',
 'Vitamin C, Niacinamide, Hyaluronic Acid',
 'Apply few drops on face and neck morning and night.',
 'Vitamin C Brightening Fluid - Rashel Store', 'Lightweight skin brightening fluid.', 4.80, 'active');

-- 6. Seed Product Variants
INSERT INTO product_variants (id, product_id, sku, size, volume, price, sale_price, stock, status) VALUES
-- Rice Water Serum variants
(1, 1, 'RW-SERUM-50ML', 'Small Bottle', '50ml', 499.00, 399.00, 150, 'active'),
(2, 1, 'RW-SERUM-100ML', 'Standard Bottle', '100ml', 899.00, 699.00, 80, 'active'),
(3, 1, 'RW-SERUM-200ML', 'Jumbo Family Pack', '200ml', 1599.00, 1199.00, 30, 'active'),
-- Vitamin C Face Wash variants
(4, 2, 'VC-WASH-100ML', 'Tube Pack', '100ml', 250.00, 199.00, 250, 'active'),
(5, 2, 'VC-WASH-150ML', 'Pump Dispenser', '150ml', 350.00, 279.00, 120, 'active'),
-- De-Tan Scrub
(6, 3, 'DT-SCRUB-200G', 'Standard Tub', '200g', 380.00, 299.00, 100, 'active'),
(7, 3, 'DT-SCRUB-400G', 'Professional Tub', '400g', 650.00, 499.00, 50, 'active'),
-- Sunscreen
(8, 4, 'SUN-SPF50-50ML', 'Standard Tube', '50ml', 299.00, 249.00, 200, 'active'),
(9, 4, 'SUN-SPF50-100ML', 'Large Tube', '100ml', 499.00, 399.00, 110, 'active'),
-- Onion Shampoo
(10, 5, 'ON-SHAMP-200ML', 'Regular Bottle', '200ml', 320.00, 269.00, 180, 'active'),
(11, 5, 'ON-SHAMP-400ML', 'VIP Pump Bottle', '400ml', 599.00, 479.00, 90, 'active'),
-- New products variants
(12, 6, 'VC-GEL-100ML', 'Standard', '100ml', 449.00, 349.00, 150, 'active'),
(13, 7, 'CHAR-MASK-100G', 'Standard', '100g', 499.00, 399.00, 150, 'active'),
(14, 8, 'GOLD-EYE-50ML', 'Standard', '50ml', 799.00, 549.00, 150, 'active'),
(15, 9, 'SAL-CLEAN-100ML', 'Standard', '100ml', 399.00, 299.00, 150, 'active'),
(16, 10, 'VC-FLUID-50ML', 'Standard', '50ml', 599.00, 479.00, 150, 'active');

-- 7. Seed Variant Images
INSERT INTO product_variant_images (id, variant_id, image_url) VALUES
(1, 1, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop'),
(2, 2, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop'),
(3, 3, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop'),
(4, 4, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500&auto=format&fit=crop'),
(5, 5, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500&auto=format&fit=crop'),
(6, 6, 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500&auto=format&fit=crop'),
(7, 7, 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500&auto=format&fit=crop'),
(8, 8, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=500&auto=format&fit=crop'),
(9, 9, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=500&auto=format&fit=crop'),
(10, 10, 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=500&auto=format&fit=crop'),
(11, 11, 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=500&auto=format&fit=crop'),
(12, 12, '/slider_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_4.png'),
(13, 13, '/slider_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_5.png'),
(14, 14, '/slider_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_6.png'),
(15, 15, '/slider_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_7.png'),
(16, 16, '/slider_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_8.png');

-- 8. Seed Product Tags
INSERT INTO product_tags (product_id, tag_name) VALUES
(1, 'Glass Skin'), (1, 'Hydrating'), (1, 'Best Seller'),
(2, 'Brightening'), (2, 'Collagen'),
(3, 'D-Tan'), (3, 'Walnut Scrub'),
(4, 'Sunscreen'), (4, 'SPF 50'),
(5, 'Anti-Hairfall'), (5, 'Onion Oil'),
(6, 'Discount Offer'), (6, 'Best Seller'),
(7, 'Discount Offer'), (7, 'Best Seller'),
(8, 'Discount Offer'), (8, 'Best Seller'),
(9, 'Discount Offer'),
(10, 'Discount Offer');

-- 9. Seed Addresses for mock users
INSERT INTO addresses (id, user_id, name, phone, street_address, city, state, zip_code, country, is_default) VALUES
(1, 5, 'Amit Sharma', '+919876543210', 'Plot No. 12, VIP Enclave, Sector 45', 'Gurugram', 'Haryana', '122003', 'India', TRUE);

-- 10. Seed Coupons
INSERT INTO coupons (id, code, discount_type, discount_value, min_order_amount, max_discount, expires_at, status) VALUES
(1, 'VIPGLOW', 'percentage', 20.00, 999.00, 500.00, '2027-12-31 23:59:59', 'active'),
(2, 'WELCOME100', 'fixed', 100.00, 499.00, 100.00, '2027-12-31 23:59:59', 'active');

-- 11. Seed Banners & Sliders
INSERT INTO sliders (title, subtitle, image_url, link_url, status) VALUES
('Freshness from Head to Toe', 'Flat 20% Off Shower Essentials & De-Tan Ranges', '/Shower_Essentials_Sale_Website_Banner-01.png', '/shop', 'active'),
('Exclusive Tiered Offers', 'Shop more, save more with special discount tiers', '/Tiered_Offer_Campaign_Website_Banner_1-01.png', '/shop', 'active'),
('Professional Botanical Care', 'Clinically proven vegan skincare formulations', '/jamal_website_banner_desktop_jpg_791fe946-fb17-4db6-854f-f3fcbfbfd38c.png', '/shop', 'active');

INSERT INTO banners (title, image_url, link_url, position, status) VALUES
('EXCLUSIVE DEALS ON BESTSELLERS', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop', '/shop?tag=Best+Seller', 'top_bar', 'active'),

-- Rice Water Hero Banners
('Rice Water Serum Website Banner', '/hero_rice/Rice_Water_Serum_Website_Banner-01_11zon.png', '/shop', 'rice_water_hero', 'active'),
('Fab Five Banner', '/hero_rice/fab_five_Banner-1920x512_jpg.png', '/shop', 'rice_water_hero', 'active'),

-- Buy 1 Get 1 Deals (BOGO)
('Vitamin C Face Wash BOGO', '/byone_getfree/Buy1Get1Free_V2-04.jpg_1.png', '/shop', 'bogo_deal', 'active'),
('Korean Glass Skin Wash BOGO', '/byone_getfree/Buy1Get1Free_V2-06.jpg_1.png', '/shop', 'bogo_deal', 'active'),
('De-Tan Face Pack BOGO', '/byone_getfree/WhatsAppImage2026-05-22at1.27.08PM_1.png', '/shop', 'bogo_deal', 'active'),
('Charcoal Scrub BOGO', '/byone_getfree/WhatsAppImage2026-05-22at1.27.09PM.png', '/shop', 'bogo_deal', 'active'),
('Nose Strips Pack BOGO', '/byone_getfree/WhatsAppImage2026-05-22at1.27.09PM_1.png', '/shop', 'bogo_deal', 'active'),
('Sunscreen Gel BOGO', '/byone_getfree/WhatsAppImage2026-05-22at1.27.10PM.png', '/shop', 'bogo_deal', 'active'),

-- Super Saver Combos
('Combos @ 749', '/Super_Saver_Combos/Combos_749_jpg.png', '/shop', 'super_saver_combo', 'active'),
('Combos @ 1099', '/Super_Saver_Combos/Combos_1099.jpg_1.png', '/shop', 'super_saver_combo', 'active'),
('Combos @ 1499', '/Super_Saver_Combos/Combos_1499.jpg_1.png', '/shop', 'super_saver_combo', 'active'),

-- Korean Range Section
('NO DRAMA, ONLY FLAWLESS GLOW!', '/koren_products/korean_range_summer_theme-01_jpg.png', '/shop', 'korean_range_banner', 'active'),
('Korean Pack of 4 Flat 25% Off', '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM.png', '/shop', 'korean_range_card', 'active'),
('Korean CSMS Flat 46% Off', '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_1.png', '/shop', 'korean_range_card', 'active'),
('Korean Glass Skin Set Flat 43% Off', '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_2.png', '/shop', 'korean_range_card', 'active'),
('Explore Korean Range Flat 50% Off', '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_3.png', '/shop', 'korean_range_card', 'active');

-- 12. Seed Testimonials
INSERT INTO testimonials (user_name, rating, comment, video_url, image_url, status) VALUES
('Riya Kapoor', 5, 'The Rice Water Serum completely changed my skincare game! My spots are fading and my skin is so soft.', NULL, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop', 'active'),
('Vikram Malhotra', 5, 'Best De-Tan scrub I have ever used. Smells amazing and cleans off oil and dirt immediately.', NULL, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop', 'active');

-- 13. Seed FAQs
INSERT INTO faqs (question, answer, category) VALUES
('How do I choose the right product for my skin concern?', 'You can filter our Shop page by "Concern" (Acne, Brightening, De-Tan, Hair Fall, etc.) or consult our customer support chat.', 'General'),
('Are these products suitable for sensitive skin?', 'Yes, our products are dermatologically tested. However, we always recommend doing a patch test on your forearm before full application.', 'Usage'),
('How long does shipping take?', 'Usually, shipping takes 3-5 business days across India. Tracking info is shared via email & notifications.', 'Delivery');

-- 14. Seed Blog Categories
INSERT INTO blog_categories (id, name, slug) VALUES
(1, 'Skincare Tips', 'skincare-tips'),
(2, 'Haircare Secrets', 'haircare-secrets');

-- 15. Seed Blogs
INSERT INTO blogs (id, blog_category_id, title, slug, content, image_url, meta_title, meta_description) VALUES
(1, 1, 'Best Serums for Acne and Spotless Skin', 'best-serums-for-acne', 
 'Acne can be a challenging skin issue. In this article, we explain how ingredients like Niacinamide and Fermented Rice Water work wonders on healing scars and controlling oil production. We recommend our signature Rice Water Serum...', 
 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=500&auto=format&fit=crop', 
 'Top Acne Healing Serums | VIP Skincare Blogs', 'Discover the top ingredients to target stubborn acne scars. Learn about Rice Water benefits.');

-- 16. Seed Store Locations
INSERT INTO store_locations (name, address, phone, lat, lng) VALUES
('VIP Rashel Flagship Store - Delhi', '102, Connaught Place, New Delhi, Delhi 110001', '+91114567890', 28.6304, 77.2177);

-- 17. Seed SEO Pages
INSERT INTO seo_pages (page_path, meta_title, meta_description, canonical_url) VALUES
('/', 'VIP Dr. Rashel India | Premium Skincare & Haircare Products', 'Shop premium Vitamin C serums, Rice water treatments, and anti-hairfall solutions. Express shipping and COD available.', 'https://dr.rashel.in/'),
('/shop', 'Luxury Shop - Skincare Collections | VIP Rashel', 'Browse our VIP face care serums, cleansers, scrubs, and hair oils. Filter by skin concern and skin type.', 'https://dr.rashel.in/shop');

-- 18. Seed Settings
INSERT INTO settings (setting_key, setting_value) VALUES
('site_name', 'VIP Rashel Skincare'),
('contact_email', 'support@rashel.in'),
('support_phone', '+91 1800-123-4567'),
('currency_symbol', '₹');
