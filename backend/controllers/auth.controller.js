import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields (name, email, password) are required.' });
    }

    // Check if user already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email address already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'user']
    );

    // Also initialize an empty cart for this user
    await pool.query('INSERT INTO carts (user_id) VALUES (?)', [result.insertId]);

    // Issue verification token
    const verificationToken = Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await pool.query(
      'INSERT INTO email_verifications (email, token, expires_at) VALUES (?, ?, ?)',
      [email, verificationToken, expiresAt]
    );

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully. Verification email sent (mocked).',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    // Cookie configuration
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000 // 7 days or 15 mins
    };

    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Refresh token is required.' });
    }

    // Check database
    const [tokens] = await pool.query('SELECT * FROM refresh_tokens WHERE token = ?', [token]);
    if (tokens.length === 0) {
      return res.status(403).json({ success: false, message: 'Refresh token is invalid or expired.' });
    }

    const dbToken = tokens[0];
    if (new Date() > new Date(dbToken.expires_at)) {
      await pool.query('DELETE FROM refresh_tokens WHERE id = ?', [dbToken.id]);
      return res.status(403).json({ success: false, message: 'Refresh token has expired.' });
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      return res.status(403).json({ success: false, message: 'Refresh token validation failed.' });
    }

    const [users] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.id]);
    if (users.length === 0) {
      return res.status(403).json({ success: false, message: 'User not found.' });
    }

    const user = users[0];
    const newAccessToken = generateAccessToken(user);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000
    });

    return res.json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (token) {
      await pool.query('DELETE FROM refresh_tokens WHERE token = ?', [token]);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const [users] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ success: false, message: 'No account found with this email.' });
    }

    // Generate reset token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await pool.query(
      'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)',
      [email, token, expiresAt]
    );

    // Mock sending email
    console.log(`[SMTP MOCK] Password reset link sent to ${email}: http://localhost:5173/reset-password?token=${token}`);

    return res.json({
      success: true,
      message: 'Password reset link sent to your email (check console output for link).'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password are required.' });
    }

    const [resets] = await pool.query('SELECT * FROM password_resets WHERE token = ?', [token]);
    if (resets.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
    }

    const reset = resets[0];
    if (new Date() > new Date(reset.expires_at)) {
      await pool.query('DELETE FROM password_resets WHERE id = ?', [reset.id]);
      return res.status(400).json({ success: false, message: 'Reset token has expired.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, reset.email]);

    // Clean up reset token
    await pool.query('DELETE FROM password_resets WHERE email = ?', [reset.email]);

    return res.json({ success: true, message: 'Password has been updated successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({ success: true, user: users[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
