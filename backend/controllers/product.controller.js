import pool from '../config/db.js';

export const getProducts = async (req, res) => {
  try {
    const { category, subcategory, brand, search, concern, tag, minPrice, maxPrice, rating, sort } = req.query;

    let query = `
      SELECT p.*, 
             c.name AS category_name, c.slug AS category_slug,
             sc.name AS subcategory_name, sc.slug AS subcategory_slug,
             b.name AS brand_name,
             MIN(pv.price) AS min_price,
             MIN(pv.sale_price) AS min_sale_price,
             SUM(pv.stock) AS total_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN sub_categories sc ON p.sub_category_id = sc.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      LEFT JOIN product_tags pt ON p.id = pt.product_id
      WHERE p.status = 'active'
    `;

    const queryParams = [];

    // Filter clauses
    if (category) {
      query += ` AND c.slug = ?`;
      queryParams.push(category);
    }
    if (subcategory) {
      query += ` AND sc.slug = ?`;
      queryParams.push(subcategory);
    }
    if (brand) {
      query += ` AND b.slug = ?`;
      queryParams.push(brand);
    }
    if (concern) {
      query += ` AND p.description LIKE ?`; // Simple concern tag matching
      queryParams.push(`%${concern}%`);
    }
    if (tag) {
      query += ` AND pt.tag_name = ?`;
      queryParams.push(tag);
    }
    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    if (rating) {
      query += ` AND p.rating >= ?`;
      queryParams.push(parseFloat(rating));
    }

    query += ` GROUP BY p.id`;

    // Price Filtering post-grouping (having min price between range)
    let havingClause = [];
    if (minPrice) {
      havingClause.push(`(min_sale_price >= ? OR (min_sale_price IS NULL AND min_price >= ?))`);
      queryParams.push(parseFloat(minPrice), parseFloat(minPrice));
    }
    if (maxPrice) {
      havingClause.push(`(min_sale_price <= ? OR (min_sale_price IS NULL AND min_price <= ?))`);
      queryParams.push(parseFloat(maxPrice), parseFloat(maxPrice));
    }

    if (havingClause.length > 0) {
      query += ` HAVING ` + havingClause.join(' AND ');
    }

    // Sorting options
    if (sort === 'price_low') {
      query += ` ORDER BY COALESCE(min_sale_price, min_price) ASC`;
    } else if (sort === 'price_high') {
      query += ` ORDER BY COALESCE(min_sale_price, min_price) DESC`;
    } else if (sort === 'rating') {
      query += ` ORDER BY p.rating DESC`;
    } else if (sort === 'best_selling') {
      query += ` ORDER BY p.rating DESC`; // Mocking best selling with high rating
    } else {
      query += ` ORDER BY p.created_at DESC`; // Default newest
    }

    const [products] = await pool.query(query, queryParams);

    // Fetch images and tags for each product
    for (let product of products) {
      const [variants] = await pool.query(`
        SELECT pv.*, pvi.image_url 
        FROM product_variants pv
        LEFT JOIN product_variant_images pvi ON pv.id = pvi.variant_id
        WHERE pv.product_id = ? AND pv.status = 'active'
      `, [product.id]);
      
      const [tags] = await pool.query('SELECT tag_name FROM product_tags WHERE product_id = ?', [product.id]);

      product.variants = variants;
      product.tags = tags.map(t => t.tag_name);
      // Main preview image
      product.image_url = variants[0]?.image_url || 'https://via.placeholder.com/300';
    }

    return res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getProductByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let query = `
      SELECT p.*, 
             c.name AS category_name, c.slug AS category_slug,
             sc.name AS subcategory_name, sc.slug AS subcategory_slug,
             b.name AS brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN sub_categories sc ON p.sub_category_id = sc.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE (p.id = ? OR p.slug = ?) AND p.status = 'active'
    `;

    const [products] = await pool.query(query, [idOrSlug, idOrSlug]);
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const product = products[0];

    // Fetch Variants with images
    const [variants] = await pool.query('SELECT * FROM product_variants WHERE product_id = ? AND status = "active"', [product.id]);
    for (let variant of variants) {
      const [images] = await pool.query('SELECT image_url FROM product_variant_images WHERE variant_id = ?', [variant.id]);
      variant.images = images.map(img => img.image_url);
    }

    // Fetch Tags
    const [tags] = await pool.query('SELECT tag_name FROM product_tags WHERE product_id = ?', [product.id]);

    // Fetch Reviews
    const [reviews] = await pool.query(`
      SELECT r.*, u.name as user_name 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `, [product.id]);

    product.variants = variants;
    product.tags = tags.map(t => t.tag_name);
    product.reviews = reviews;

    return res.json({ success: true, product });
  } catch (error) {
    console.error('Get single product error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { 
      category_id, sub_category_id, brand_id, name, slug, 
      description, benefits, ingredients, how_to_use, 
      meta_title, meta_description, variants, tags 
    } = req.body;

    if (!name || !slug || !description) {
      return res.status(400).json({ success: false, message: 'Name, slug, and description are required.' });
    }

    const [result] = await pool.query(`
      INSERT INTO products (category_id, sub_category_id, brand_id, name, slug, description, benefits, ingredients, how_to_use, meta_title, meta_description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [category_id, sub_category_id, brand_id, name, slug, description, benefits, ingredients, how_to_use, meta_title, meta_description]);

    const productId = result.insertId;

    // Insert variants
    if (variants && Array.isArray(variants)) {
      for (let variant of variants) {
        const [vResult] = await pool.query(`
          INSERT INTO product_variants (product_id, sku, size, volume, price, sale_price, stock, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [productId, variant.sku, variant.size, variant.volume, variant.price, variant.sale_price, variant.stock, variant.status || 'active']);

        const variantId = vResult.insertId;

        if (variant.images && Array.isArray(variant.images)) {
          for (let img of variant.images) {
            await pool.query('INSERT INTO product_variant_images (variant_id, image_url) VALUES (?, ?)', [variantId, img]);
          }
        }
      }
    }

    // Insert tags
    if (tags && Array.isArray(tags)) {
      for (let tag of tags) {
        await pool.query('INSERT INTO product_tags (product_id, tag_name) VALUES (?, ?)', [productId, tag]);
      }
    }

    return res.status(201).json({ success: true, message: 'Product created successfully.', productId });
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      category_id, sub_category_id, brand_id, name, slug, 
      description, benefits, ingredients, how_to_use, 
      meta_title, meta_description, status, variants, tags 
    } = req.body;

    await pool.query(`
      UPDATE products 
      SET category_id = ?, sub_category_id = ?, brand_id = ?, name = ?, slug = ?, 
          description = ?, benefits = ?, ingredients = ?, how_to_use = ?, 
          meta_title = ?, meta_description = ?, status = ?
      WHERE id = ?
    `, [category_id, sub_category_id, brand_id, name, slug, description, benefits, ingredients, how_to_use, meta_title, meta_description, status, id]);

    // Delete existing variants (this cascades and deletes variant images automatically)
    await pool.query('DELETE FROM product_variants WHERE product_id = ?', [id]);
    
    // Delete existing tags
    await pool.query('DELETE FROM product_tags WHERE product_id = ?', [id]);

    // Insert new variants
    if (variants && Array.isArray(variants)) {
      for (let variant of variants) {
        const [vResult] = await pool.query(`
          INSERT INTO product_variants (product_id, sku, size, volume, price, sale_price, stock, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [id, variant.sku, variant.size, variant.volume, variant.price, variant.sale_price, variant.stock, variant.status || 'active']);

        const variantId = vResult.insertId;

        // Support both single image_url string or array of images
        if (variant.images && Array.isArray(variant.images)) {
          for (let img of variant.images) {
            await pool.query('INSERT INTO product_variant_images (variant_id, image_url) VALUES (?, ?)', [variantId, img]);
          }
        } else if (variant.image_url) {
          await pool.query('INSERT INTO product_variant_images (variant_id, image_url) VALUES (?, ?)', [variantId, variant.image_url]);
        }
      }
    }

    // Insert new tags
    if (tags && Array.isArray(tags)) {
      for (let tag of tags) {
        await pool.query('INSERT INTO product_tags (product_id, tag_name) VALUES (?, ?)', [id, tag]);
      }
    }

    return res.json({ success: true, message: 'Product updated successfully.' });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    return res.json({ success: true, categories: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, image_url } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Name and slug are required.' });
    }
    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, image_url) VALUES (?, ?, ?)',
      [name, slug, image_url || null]
    );
    return res.json({ success: true, message: 'Category created successfully.', categoryId: result.insertId });
  } catch (error) {
    console.error('Create category error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, image_url } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Name and slug are required.' });
    }
    await pool.query(
      'UPDATE categories SET name = ?, slug = ?, image_url = ? WHERE id = ?',
      [name, slug, image_url || null, id]
    );
    return res.json({ success: true, message: 'Category updated successfully.' });
  } catch (error) {
    console.error('Update category error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE products SET category_id = NULL WHERE category_id = ?', [id]);
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getSubCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sub_categories');
    return res.json({ success: true, subcategories: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getBrands = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM brands');
    return res.json({ success: true, brands: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
