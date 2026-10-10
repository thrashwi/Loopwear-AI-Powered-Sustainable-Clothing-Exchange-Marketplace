import jwt from 'jsonwebtoken';
import { db } from '../data/db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'loopwear_super_secret_jwt_key_2026';

export function authenticate(req, res, next) {
  try {
    let token = null;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    let userId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // Handle demo token format `demo_jwt_token_${id}` for backward compatibility
        if (token.startsWith('demo_jwt_token_')) {
          userId = token.replace('demo_jwt_token_', '');
        } else {
          return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
        }
      }
    } else if (req.headers['x-user-id']) {
      userId = req.headers['x-user-id'];
    }

    if (userId) {
      const user = db.findUserById(userId);
      if (user) {
        if (user.status === 'suspended') {
          return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact moderation.' });
        }
        req.user = user;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function requireAuth(req, res, next) {
  authenticate(req, res, () => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required to access this resource.' });
    }
    next();
  });
}

export function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Administrative privileges required.' });
    }
    next();
  });
}
