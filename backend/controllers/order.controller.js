import pool from '../config/db.js';

export const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { addressId, paymentMethod, items, couponCode } = req.body;
    const userId = req.user.id;

    if (!addressId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Address and shopping cart items are required.' });
    }

    // Calculate prices & check stock
    let totalAmount = 0;
    const validatedItems = [];

    for (let item of items) {
      const [variants] = await connection.query(
        'SELECT pv.*, p.name FROM product_variants pv JOIN products p ON pv.product_id = p.id WHERE pv.id = ?',
        [item.variantId]
      );

      if (variants.length === 0) {
        throw new Error(`Variant ID ${item.variantId} not found.`);
      }

      const variant = variants[0];
      if (variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${variant.name} (${variant.size || variant.volume}). Available: ${variant.stock}`);
      }

      const price = variant.sale_price ? parseFloat(variant.sale_price) : parseFloat(variant.price);
      totalAmount += price * item.quantity;

      validatedItems.push({
        variantId: variant.id,
        quantity: item.quantity,
        price: price,
        currentStock: variant.stock
      });
    }

    // Process Coupon if provided
    let discountAmount = 0;
    let couponId = null;

    if (couponCode) {
      const [coupons] = await connection.query(
        'SELECT * FROM coupons WHERE code = ? AND status = "active" AND expires_at > NOW()',
        [couponCode]
      );

      if (coupons.length > 0) {
        const coupon = coupons[0];
        if (totalAmount >= parseFloat(coupon.min_order_amount)) {
          couponId = coupon.id;
          if (coupon.discount_type === 'percentage') {
            discountAmount = (totalAmount * parseFloat(coupon.discount_value)) / 100;
            if (coupon.max_discount && discountAmount > parseFloat(coupon.max_discount)) {
              discountAmount = parseFloat(coupon.max_discount);
            }
          } else {
            discountAmount = parseFloat(coupon.discount_value);
          }
        }
      }
    }

    const finalAmount = Math.max(0, totalAmount - discountAmount);

    // Create Order Record
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, address_id, total_amount, discount_amount, coupon_id, status) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, addressId, finalAmount, discountAmount, couponId, 'Pending']
    );
    const orderId = orderResult.insertId;

    // Create Order Items and Update Stock
    for (let vItem of validatedItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_variant_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, vItem.variantId, vItem.quantity, vItem.price]
      );

      // Decrement stock
      const newStock = vItem.currentStock - vItem.quantity;
      await connection.query(
        'UPDATE product_variants SET stock = ? WHERE id = ?',
        [newStock, vItem.variantId]
      );
    }

    // Process Coupon usage
    if (couponId) {
      await connection.query(
        'INSERT INTO coupon_usage (coupon_id, user_id, order_id) VALUES (?, ?, ?)',
        [couponId, userId, orderId]
      );
    }

    // Create Payment record
    const [paymentResult] = await connection.query(
      'INSERT INTO payments (order_id, payment_method, amount, status) VALUES (?, ?, ?, ?)',
      [orderId, paymentMethod || 'COD', finalAmount, paymentMethod === 'COD' ? 'Pending' : 'Pending']
    );

    // Mock successful transactions for payment gateways like Stripe/PayPal/Razorpay
    if (paymentMethod && paymentMethod !== 'COD') {
      const transactionRef = 'TXN-' + Math.random().toString(36).substring(2, 12).toUpperCase();
      
      // Update Payment status to Completed
      await connection.query(
        'UPDATE payments SET status = "Completed" WHERE id = ?',
        [paymentResult.insertId]
      );
      
      // Create Transaction log
      await connection.query(
        'INSERT INTO transactions (payment_id, transaction_reference, raw_response) VALUES (?, ?, ?)',
        [paymentResult.insertId, transactionRef, JSON.stringify({ gateway: paymentMethod, status: 'success' })]
      );
    }

    // Create notification
    await connection.query(
      'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
      [userId, 'Order Placed successfully', `Your order #${orderId} of amount ₹${finalAmount} has been placed successfully.`]
    );

    // Clear User Cart
    const [carts] = await connection.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (carts.length > 0) {
      await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [carts[0].id]);
    }

    await connection.commit();
    connection.release();

    return res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      orderId,
      totalAmount: finalAmount
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Order creation error:', error);
    return res.status(400).json({ success: false, message: error.message || 'Error processing order.' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const [orders] = await pool.query(
      `SELECT o.*, a.street_address, a.city, a.state, a.zip_code, pay.payment_method, pay.status as payment_status
       FROM orders o
       LEFT JOIN addresses a ON o.address_id = a.id
       LEFT JOIN payments pay ON o.id = pay.order_id
       WHERE o.user_id = ? ORDER BY o.created_at DESC`,
      [userId]
    );

    for (let order of orders) {
      const [items] = await pool.query(
        `SELECT oi.*, pv.size, pv.volume, pv.sku, p.name as product_name, p.slug as product_slug,
                (SELECT image_url FROM product_variant_images WHERE variant_id = pv.id LIMIT 1) as image_url
         FROM order_items oi
         LEFT JOIN product_variants pv ON oi.product_variant_id = pv.id
         LEFT JOIN products p ON pv.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    return res.json({ success: true, orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT o.*, u.name as user_name, u.email as user_email, pay.payment_method, pay.status as payment_status
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN payments pay ON o.id = pay.order_id
    `;
    const params = [];
    if (status) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }
    query += ' ORDER BY o.created_at DESC';

    const [orders] = await pool.query(query, params);

    for (let order of orders) {
      const [items] = await pool.query(
        `SELECT oi.*, pv.size, pv.volume, pv.sku, p.name as product_name,
                (SELECT image_url FROM product_variant_images WHERE variant_id = pv.id LIMIT 1) as image_url
         FROM order_items oi
         LEFT JOIN product_variants pv ON oi.product_variant_id = pv.id
         LEFT JOIN products p ON pv.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    return res.json({ success: true, orders });
  } catch (error) {
    console.error('Get all orders admin error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Pending, Processing, Shipped, Delivered, Cancelled

    if (!['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Fetch user id to send notification
    const [orders] = await pool.query('SELECT user_id FROM orders WHERE id = ?', [id]);
    if (orders.length > 0) {
      await pool.query(
        'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
        [orders[0].user_id, 'Order Update', `Your order #${id} status has been updated to ${status}.`]
      );
    }

    return res.json({ success: true, message: `Order status updated to ${status} successfully.` });
  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required.' });
    }

    const [coupons] = await pool.query(
      'SELECT * FROM coupons WHERE code = ? AND status = "active" AND expires_at > NOW()',
      [code]
    );

    if (coupons.length === 0) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
    }

    const coupon = coupons[0];
    if (amount && parseFloat(amount) < parseFloat(coupon.min_order_amount)) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.min_order_amount} required to use coupon.`
      });
    }

    return res.json({ success: true, coupon });
  } catch (error) {
    console.error('Validate coupon error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
