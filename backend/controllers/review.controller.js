import pool from '../config/db.js';

export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!productId || !rating) {
      return res.status(400).json({ success: false, message: 'Product ID and rating (1-5) are required.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
    }

    // Verify if user already reviewed
    const [existing] = await pool.query(
      'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product.' });
    }

    // Insert review
    await pool.query(
      'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
      [userId, productId, rating, comment || '']
    );

    // Update product rating average
    const [avgResult] = await pool.query(
      'SELECT AVG(rating) as avgRating FROM reviews WHERE product_id = ?',
      [productId]
    );

    const newAvg = avgResult[0].avgRating || rating;
    await pool.query('UPDATE products SET rating = ? WHERE id = ?', [newAvg, productId]);

    return res.status(201).json({ success: true, message: 'Review submitted successfully.' });
  } catch (error) {
    console.error('Submit review error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const [reviews] = await pool.query(
      `SELECT r.*, u.name as user_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.product_id = ? 
       ORDER BY r.created_at DESC`,
      [productId]
    );
    return res.json({ success: true, reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
