import pool from '../config/db.js';

export const getBlogs = async (req, res) => {
  try {
    const { category } = req.query;
    let query = `
      SELECT b.*, bc.name as category_name, bc.slug as category_slug
      FROM blogs b
      JOIN blog_categories bc ON b.blog_category_id = bc.id
    `;
    const params = [];
    if (category) {
      query += ' WHERE bc.slug = ?';
      params.push(category);
    }
    query += ' ORDER BY b.created_at DESC';

    const [rows] = await pool.query(query, params);
    return res.json({ success: true, blogs: rows });
  } catch (error) {
    console.error('Get blogs error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [blogs] = await pool.query(
      `SELECT b.*, bc.name as category_name 
       FROM blogs b
       JOIN blog_categories bc ON b.blog_category_id = bc.id
       WHERE b.slug = ?`,
      [slug]
    );

    if (blogs.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog post not found.' });
    }

    const blog = blogs[0];

    // Fetch comments
    const [comments] = await pool.query(
      'SELECT * FROM blog_comments WHERE blog_id = ? ORDER BY created_at DESC',
      [blog.id]
    );
    blog.comments = comments;

    return res.json({ success: true, blog });
  } catch (error) {
    console.error('Get single blog error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { blog_category_id, title, slug, content, image_url, meta_title, meta_description } = req.body;
    if (!title || !slug || !content || !blog_category_id) {
      return res.status(400).json({ success: false, message: 'Category, title, slug, and content are required.' });
    }

    await pool.query(
      `INSERT INTO blogs (blog_category_id, title, slug, content, image_url, meta_title, meta_description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [blog_category_id, title, slug, content, image_url, meta_title, meta_description]
    );

    return res.status(201).json({ success: true, message: 'Blog post created successfully.' });
  } catch (error) {
    console.error('Create blog error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getBlogCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM blog_categories');
    return res.json({ success: true, categories: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addBlogComment = async (req, res) => {
  try {
    const { blogId, name, comment } = req.body;
    if (!blogId || !name || !comment) {
      return res.status(400).json({ success: false, message: 'Blog ID, name, and comment content are required.' });
    }

    await pool.query(
      'INSERT INTO blog_comments (blog_id, user_name, comment) VALUES (?, ?, ?)',
      [blogId, name, comment]
    );

    return res.status(201).json({ success: true, message: 'Comment added successfully.' });
  } catch (error) {
    console.error('Add blog comment error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
