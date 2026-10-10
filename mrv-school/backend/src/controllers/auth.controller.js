const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { sha256, signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/tokens');
const { logAudit } = require('../utils/audit');

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const REFRESH_COOKIE_NAME = 'mrvps_refresh';
const isProd = process.env.NODE_ENV === 'production';

function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/api/auth',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };
}

async function issueTokens(user, req, res, family = crypto.randomUUID()) {
  const accessToken = signAccessToken(user);
  const { token: refreshToken, jti } = signRefreshToken(user._id, family);

  await RefreshToken.create({
    user: user._id,
    tokenHash: sha256(refreshToken),
    family,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions());
  return accessToken;
}

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError('Email and password are required', 400);

  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

  if (!user) {
    await logAudit({ req, action: 'LOGIN_FAILED', resource: 'Auth', status: 'failure', meta: { email } });
    throw new AppError('Invalid credentials', 401);
  }

  if (user.isLocked()) {
    await logAudit({ req, action: 'LOGIN_BLOCKED', resource: 'Auth', status: 'failure', meta: { email } });
    throw new AppError('Account temporarily locked due to failed login attempts. Try again later.', 423);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403);
  }

  const validPassword = await user.comparePassword(password);
  if (!validPassword) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      user.lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);
    }
    await user.save();
    await logAudit({ req, action: 'LOGIN_FAILED', resource: 'Auth', status: 'failure', meta: { email } });
    throw new AppError('Invalid credentials', 401);
  }

  user.failedLoginAttempts = 0;
  user.lockedUntil = undefined;
  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = await issueTokens(user, req, res);
  await logAudit({ req, action: 'LOGIN', resource: 'Auth', resourceId: user._id.toString() });

  res.json({
    success: true,
    data: {
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, permissions: user.permissions },
    },
  });
});

// POST /api/auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) throw new AppError('No refresh token provided', 401);

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch (err) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const tokenHash = sha256(token);
  const stored = await RefreshToken.findOne({ tokenHash });

  if (!stored || stored.revokedAt) {
    // Reuse of a revoked/unknown token => possible theft. Revoke entire family.
    if (stored) {
      await RefreshToken.updateMany(
        { family: stored.family, revokedAt: null },
        { revokedAt: new Date() }
      );
    }
    res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions());
    throw new AppError('Session invalid, please log in again', 401);
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) throw new AppError('Account not found or deactivated', 401);

  // Rotate: revoke old, issue new in same family
  stored.revokedAt = new Date();
  const accessToken = await issueTokens(user, req, res, stored.family);
  stored.replacedByHash = sha256(req.cookies[REFRESH_COOKIE_NAME]);
  await stored.save();

  res.json({
    success: true,
    data: {
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, permissions: user.permissions },
    },
  });
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (token) {
    const tokenHash = sha256(token);
    await RefreshToken.updateOne({ tokenHash }, { revokedAt: new Date() });
  }
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions());
  await logAudit({ req, action: 'LOGOUT', resource: 'Auth', resourceId: req.user?._id?.toString() });
  res.json({ success: true, message: 'Logged out' });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, permissions: req.user.permissions } });
});

// POST /api/auth/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw new AppError('Current and new password are required', 400);
  if (newPassword.length < 10) throw new AppError('New password must be at least 10 characters', 400);

  const user = await User.findById(req.user._id).select('+passwordHash');
  const valid = await user.comparePassword(currentPassword);
  if (!valid) throw new AppError('Current password is incorrect', 401);

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.passwordChangedAt = new Date();
  await user.save();

  // Revoke all existing refresh tokens on password change.
  await RefreshToken.updateMany({ user: user._id, revokedAt: null }, { revokedAt: new Date() });
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions());

  await logAudit({ req, action: 'PASSWORD_CHANGE', resource: 'Auth', resourceId: user._id.toString() });
  res.json({ success: true, message: 'Password changed. Please log in again.' });
});

module.exports = { login, refresh, logout, me, changePassword };
