import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const issueToken = (userId) => {
  return jwt.sign({ userId }, env.JWT_SECRET, { 
    expiresIn: env.JWT_EXPIRES_IN || '7d' 
  });
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    req.userId = decoded.userId;
    next();
  });
};

export const requireAuth = authenticateToken;