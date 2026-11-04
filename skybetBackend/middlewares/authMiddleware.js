import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify JWT token and attach user to req.user
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      // Fallback verification for tokens signed with fallback secret
      decoded = jwt.verify(token, 'skybet_access_secret_key');
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

// Restrict to admin role only
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin only' });
  }
};

// Optional auth - attaches user if token is provided, but does not block if absent
export const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      decoded = jwt.verify(token, 'skybet_access_secret_key');
    }
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    // If token is invalid, proceed without req.user
    next();
  }
};

