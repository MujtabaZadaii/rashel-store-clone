import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'super_secret_vip_rashel_key_123',
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = async (user) => {
  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || 'super_secret_vip_rashel_refresh_key_123',
    { expiresIn: '7d' }
  );

  // Save refresh token to MySQL database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [user.id, token, expiresAt]
  );

  return token;
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'super_secret_vip_rashel_key_123');
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'super_secret_vip_rashel_refresh_key_123');
  } catch (error) {
    return null;
  }
};
