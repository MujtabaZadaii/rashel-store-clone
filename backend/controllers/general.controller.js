import pool from '../config/db.js';

export const getBannersAndSliders = async (req, res) => {
  try {
    const [sliders] = await pool.query('SELECT * FROM sliders WHERE status = "active"');
    const [banners] = await pool.query('SELECT * FROM banners WHERE status = "active"');
    return res.json({ success: true, sliders, banners });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getFAQs = async (req, res) => {
  try {
    const [faqs] = await pool.query('SELECT * FROM faqs');
    return res.json({ success: true, faqs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getSettings = async (req, res) => {
  try {
    const [settings] = await pool.query('SELECT * FROM settings');
    const settingsMap = {};
    settings.forEach(s => {
      settingsMap[s.setting_key] = s.setting_value;
    });
    return res.json({ success: true, settings: settingsMap });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getStoreLocations = async (req, res) => {
  try {
    const [locations] = await pool.query('SELECT * FROM store_locations');
    return res.json({ success: true, locations });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }
    // Check if already subscribed
    const [existing] = await pool.query('SELECT id FROM newsletter_subscribers WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'You are already subscribed to our newsletter.' });
    }

    await pool.query('INSERT INTO newsletter_subscribers (email) VALUES (?)', [email]);
    return res.status(201).json({ success: true, message: 'Thank you for subscribing to our newsletter!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Address Management
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const [addresses] = await pool.query('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC', [userId]);
    return res.json({ success: true, addresses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, street_address, city, state, zip_code, country, is_default } = req.body;

    if (!name || !phone || !street_address || !city || !state || !zip_code) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (is_default) {
      // Set others to false
      await pool.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [userId]);
    }

    const [result] = await pool.query(
      `INSERT INTO addresses (user_id, name, phone, street_address, city, state, zip_code, country, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, phone, street_address, city, state, zip_code, country || 'India', is_default || false]
    );

    return res.status(201).json({ success: true, message: 'Address added successfully.', addressId: result.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await pool.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, userId]);
    return res.json({ success: true, message: 'Address deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Wishlist Management
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const [wishlist] = await pool.query(
      `SELECT w.id as wishlist_id, p.*, 
              (SELECT MIN(pv.price) FROM product_variants pv WHERE pv.product_id = p.id) as min_price,
              (SELECT MIN(pv.sale_price) FROM product_variants pv WHERE pv.product_id = p.id) as min_sale_price,
              (SELECT pvi.image_url FROM product_variants pv JOIN product_variant_images pvi ON pv.id = pvi.variant_id WHERE pv.product_id = p.id LIMIT 1) as image_url
       FROM wishlists w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ?`,
      [userId]
    );
    return res.json({ success: true, wishlist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    // Check if already exists
    const [existing] = await pool.query('SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?', [userId, productId]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist.' });
    }

    await pool.query('INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)', [userId, productId]);
    return res.status(201).json({ success: true, message: 'Product added to wishlist.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    await pool.query('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?', [userId, productId]);
    return res.json({ success: true, message: 'Product removed from wishlist.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// SEO Page Metadata
export const getSEOMetadata = async (req, res) => {
  try {
    const { path } = req.query;
    const [rows] = await pool.query('SELECT * FROM seo_pages WHERE page_path = ?', [path || '/']);
    if (rows.length > 0) {
      return res.json({ success: true, seo: rows[0] });
    }
    return res.json({ 
      success: true, 
      seo: { 
        meta_title: 'VIP Rashel Skincare Store', 
        meta_description: 'Welcome to the premium skincare and body cosmetics hub.' 
      } 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin CRUD for Sliders
export const getBannersAndSlidersAdmin = async (req, res) => {
  try {
    const [sliders] = await pool.query('SELECT * FROM sliders');
    const [banners] = await pool.query('SELECT * FROM banners');
    return res.json({ success: true, sliders, banners });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createSlider = async (req, res) => {
  try {
    const { title, subtitle, image_url, link_url, status } = req.body;
    if (!image_url) {
      return res.status(400).json({ success: false, message: 'Image URL is required.' });
    }
    const [result] = await pool.query(
      'INSERT INTO sliders (title, subtitle, image_url, link_url, status) VALUES (?, ?, ?, ?, ?)',
      [title || null, subtitle || null, image_url, link_url || null, status || 'active']
    );
    return res.status(201).json({ success: true, message: 'Slider added successfully.', sliderId: result.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, image_url, link_url, status } = req.body;
    await pool.query(
      'UPDATE sliders SET title = ?, subtitle = ?, image_url = ?, link_url = ?, status = ? WHERE id = ?',
      [title || null, subtitle || null, image_url, link_url || null, status || 'active', id]
    );
    return res.json({ success: true, message: 'Slider updated successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM sliders WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Slider deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin CRUD for Banners
export const createBanner = async (req, res) => {
  try {
    const { title, image_url, link_url, position, status } = req.body;
    if (!image_url) {
      return res.status(400).json({ success: false, message: 'Image URL is required.' });
    }
    const [result] = await pool.query(
      'INSERT INTO banners (title, image_url, link_url, position, status) VALUES (?, ?, ?, ?, ?)',
      [title || null, image_url, link_url || null, position || 'middle_promo', status || 'active']
    );
    return res.status(201).json({ success: true, message: 'Banner added successfully.', bannerId: result.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image_url, link_url, position, status } = req.body;
    await pool.query(
      'UPDATE banners SET title = ?, image_url = ?, link_url = ?, position = ?, status = ? WHERE id = ?',
      [title || null, image_url, link_url || null, position || 'middle_promo', status || 'active', id]
    );
    return res.json({ success: true, message: 'Banner updated successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM banners WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Banner deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Shop By Categories management controllers
export const getShopByCategories = async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM shop_by_categories');
    return res.json({ success: true, categories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createShopByCategory = async (req, res) => {
  try {
    const { name, slug, image_url, status } = req.body;
    if (!name || !slug || !image_url) {
      return res.status(400).json({ success: false, message: 'Name, slug, and image_url are required.' });
    }
    const [result] = await pool.query(
      'INSERT INTO shop_by_categories (name, slug, image_url, status) VALUES (?, ?, ?, ?)',
      [name, slug, image_url, status || 'active']
    );
    return res.status(201).json({ success: true, message: 'Shop By Category card added successfully.', categoryId: result.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateShopByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, image_url, status } = req.body;
    if (!name || !slug || !image_url) {
      return res.status(400).json({ success: false, message: 'Name, slug, and image_url are required.' });
    }
    await pool.query(
      'UPDATE shop_by_categories SET name = ?, slug = ?, image_url = ?, status = ? WHERE id = ?',
      [name, slug, image_url, status || 'active', id]
    );
    return res.json({ success: true, message: 'Shop By Category card updated successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteShopByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM shop_by_categories WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Shop By Category card deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

