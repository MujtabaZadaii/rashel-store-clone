import jwt from 'jsonwebtoken';
import { verifyAccessToken } from '../utils/jwt.js';

export const authenticate = (req, res, next) => {
  let token = null;

  // 1. Check cookies first
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  // 2. Check Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Token expired or invalid. Please refresh token or log in again.' });
  }

  req.user = decoded; // Contains id, name, email, role
  next();
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role unauthorized. Required roles: [${roles.join(', ')}]. Your current role is: ${req.user.role}`
      });
    }

    next();
  };
};
