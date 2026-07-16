-- Safe banner migration: insert only if missing
-- Run this once to populate the banners table without wiping any data
USE rashel_store;

-- BOGO Deals
INSERT INTO banners (title, image_url, link_url, position, status)
SELECT 'Vitamin C Face Wash BOGO', '/byone_getfree/Buy1Get1Free_V2-04.jpg_1.png', '/shop', 'bogo_deal', 'active'
WHERE NOT EXISTS (SELECT 1 FROM banners WHERE position = 'bogo_deal' LIMIT 1);

-- If no BOGO rows at all, insert all 6
INSERT IGNORE INTO banners (title, image_url, link_url, position, status) VALUES
('Vitamin C Face Wash BOGO', '/byone_getfree/Buy1Get1Free_V2-04.jpg_1.png', '/shop', 'bogo_deal', 'active'),
('Korean Glass Skin Wash BOGO', '/byone_getfree/Buy1Get1Free_V2-06.jpg_1.png', '/shop', 'bogo_deal', 'active'),
('De-Tan Face Pack BOGO', '/byone_getfree/WhatsAppImage2026-05-22at1.27.08PM_1.png', '/shop', 'bogo_deal', 'active'),
('Charcoal Scrub BOGO', '/byone_getfree/WhatsAppImage2026-05-22at1.27.09PM.png', '/shop', 'bogo_deal', 'active'),
('Nose Strips Pack BOGO', '/byone_getfree/WhatsAppImage2026-05-22at1.27.09PM_1.png', '/shop', 'bogo_deal', 'active'),
('Sunscreen Gel BOGO', '/byone_getfree/WhatsAppImage2026-05-22at1.27.10PM.png', '/shop', 'bogo_deal', 'active');

-- Korean Range Banner
INSERT INTO banners (title, image_url, link_url, position, status)
SELECT 'NO DRAMA, ONLY FLAWLESS GLOW!', '/koren_products/korean_range_summer_theme-01_jpg.png', '/shop', 'korean_range_banner', 'active'
WHERE (SELECT COUNT(*) FROM banners WHERE position = 'korean_range_banner') = 0;

-- Korean Range Cards
INSERT INTO banners (title, image_url, link_url, position, status)
SELECT 'Korean Pack of 4 Flat 25% Off', '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM.png', '/shop', 'korean_range_card', 'active'
WHERE (SELECT COUNT(*) FROM banners WHERE position = 'korean_range_card') = 0;

INSERT INTO banners (title, image_url, link_url, position, status)
SELECT 'Korean CSMS Flat 46% Off', '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_1.png', '/shop', 'korean_range_card', 'active'
WHERE (SELECT COUNT(*) FROM banners WHERE position = 'korean_range_card') < 2;

INSERT INTO banners (title, image_url, link_url, position, status)
SELECT 'Korean Glass Skin Set Flat 43% Off', '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_2.png', '/shop', 'korean_range_card', 'active'
WHERE (SELECT COUNT(*) FROM banners WHERE position = 'korean_range_card') < 3;

INSERT INTO banners (title, image_url, link_url, position, status)
SELECT 'Explore Korean Range Flat 50% Off', '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_3.png', '/shop', 'korean_range_card', 'active'
WHERE (SELECT COUNT(*) FROM banners WHERE position = 'korean_range_card') < 4;

-- Rice Water Hero Banners
INSERT INTO banners (title, image_url, link_url, position, status)
SELECT 'Rice Water Serum Website Banner', '/hero_rice/Rice_Water_Serum_Website_Banner-01_11zon.png', '/shop', 'rice_water_hero', 'active'
WHERE (SELECT COUNT(*) FROM banners WHERE position = 'rice_water_hero') = 0;

INSERT INTO banners (title, image_url, link_url, position, status)
SELECT 'Fab Five Banner', '/hero_rice/fab_five_Banner-1920x512_jpg.png', '/shop', 'rice_water_hero', 'active'
WHERE (SELECT COUNT(*) FROM banners WHERE position = 'rice_water_hero') < 2;

-- Verify
SELECT position, COUNT(*) as count FROM banners GROUP BY position;
