const { verifyAccessToken } = require('../utils/tokens');
const AppError = require('../utils/AppError');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

// Verifies the JWT access token and attaches req.user (lean, no password hash).
const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw new AppError('Authentication required', 401);
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (err) {
    throw new AppError('Invalid or expired token', 401);
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) {
    throw new AppError('Account not found or deactivated', 401);
  }

  // If password changed after this token was issued, invalidate it.
  if (user.passwordChangedAt && payload.tokenVersion) {
    const changedTime = new Date(user.passwordChangedAt).getTime();
    const tokenTime = new Date(payload.tokenVersion).getTime();
    if (changedTime > tokenTime) {
      throw new AppError('Session expired, please log in again', 401);
    }
  }

  req.user = user;
  next();
});

// Optional auth: attaches req.user if a valid token is present, otherwise continues.
const optionalAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();
  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (user && user.isActive) req.user = user;
  } catch (err) {
    // ignore invalid token for optional auth
  }
  next();
});

module.exports = { requireAuth, optionalAuth };
