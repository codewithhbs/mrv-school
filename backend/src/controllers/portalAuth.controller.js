const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const PortalAccount = require('../models/PortalAccount');
const PortalRefreshToken = require('../models/PortalRefreshToken');
const { sha256, signPortalAccessToken, signPortalRefreshToken, verifyPortalRefreshToken } = require('../utils/portalTokens');
const { logAudit } = require('../utils/audit');

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;
const COOKIE_NAME = 'mrvps_portal_refresh';
const isProd = process.env.NODE_ENV === 'production';

function cookieOptions() {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/api/portal/auth',
    maxAge: 60 * 24 * 60 * 60 * 1000,
  };
}

async function issueTokens(account, req, res, family = crypto.randomUUID()) {
  const accessToken = signPortalAccessToken(account);
  const { token: refreshToken } = signPortalRefreshToken(account._id, family);

  await PortalRefreshToken.create({
    account: account._id,
    tokenHash: sha256(refreshToken),
    family,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });

  res.cookie(COOKIE_NAME, refreshToken, cookieOptions());
  return accessToken;
}

function publicAccount(account) {
  return {
    id: account._id,
    name: account.name,
    email: account.email,
    role: account.role,
    mustChangePassword: account.mustChangePassword,
    students: (account.students || []).map((s) =>
      s.name
        ? { id: s._id, name: s.name, admissionNo: s.admissionNo, class: s.class, section: s.section, photo: s.photo }
        : s
    ),
  };
}

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError('Email and password are required', 400);

  const account = await PortalAccount.findOne({ email: email.toLowerCase() }).select('+passwordHash').populate('students');

  if (!account) {
    await logAudit({ req, action: 'PORTAL_LOGIN_FAILED', resource: 'PortalAuth', status: 'failure', meta: { email } });
    throw new AppError('Invalid credentials', 401);
  }
  if (account.isLocked()) throw new AppError('Account temporarily locked. Try again later.', 423);
  if (!account.isActive) throw new AppError('This account has been deactivated. Contact the school office.', 403);

  const valid = await account.comparePassword(password);
  if (!valid) {
    account.failedLoginAttempts += 1;
    if (account.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      account.lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);
    }
    await account.save();
    await logAudit({ req, action: 'PORTAL_LOGIN_FAILED', resource: 'PortalAuth', status: 'failure', meta: { email } });
    throw new AppError('Invalid credentials', 401);
  }

  account.failedLoginAttempts = 0;
  account.lockedUntil = undefined;
  account.lastLoginAt = new Date();
  await account.save();

  const accessToken = await issueTokens(account, req, res);
  await logAudit({ req, action: 'PORTAL_LOGIN', resource: 'PortalAuth', resourceId: account._id.toString() });

  res.json({ success: true, data: { accessToken, account: publicAccount(account) } });
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) throw new AppError('No session found', 401);

  let payload;
  try {
    payload = verifyPortalRefreshToken(token);
  } catch (err) {
    throw new AppError('Session expired, please log in again', 401);
  }

  const tokenHash = sha256(token);
  const stored = await PortalRefreshToken.findOne({ tokenHash });

  if (!stored || stored.revokedAt) {
    if (stored) await PortalRefreshToken.updateMany({ family: stored.family, revokedAt: null }, { revokedAt: new Date() });
    res.clearCookie(COOKIE_NAME, cookieOptions());
    throw new AppError('Session invalid, please log in again', 401);
  }

  const account = await PortalAccount.findById(payload.sub).populate('students');
  if (!account || !account.isActive) throw new AppError('Account not found or deactivated', 401);

  stored.revokedAt = new Date();
  const accessToken = await issueTokens(account, req, res, stored.family);
  stored.replacedByHash = sha256(req.cookies[COOKIE_NAME]);
  await stored.save();

  res.json({ success: true, data: { accessToken, account: publicAccount(account) } });
});

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (token) await PortalRefreshToken.updateOne({ tokenHash: sha256(token) }, { revokedAt: new Date() });
  res.clearCookie(COOKIE_NAME, cookieOptions());
  res.json({ success: true, message: 'Logged out' });
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: publicAccount(req.portalUser) });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw new AppError('Current and new password are required', 400);
  if (newPassword.length < 8) throw new AppError('New password must be at least 8 characters', 400);

  const account = await PortalAccount.findById(req.portalUser._id).select('+passwordHash');
  const valid = await account.comparePassword(currentPassword);
  if (!valid) throw new AppError('Current password is incorrect', 401);

  account.passwordHash = await bcrypt.hash(newPassword, 12);
  account.passwordChangedAt = new Date();
  account.mustChangePassword = false;
  await account.save();

  await PortalRefreshToken.updateMany({ account: account._id, revokedAt: null }, { revokedAt: new Date() });
  res.clearCookie(COOKIE_NAME, cookieOptions());

  res.json({ success: true, message: 'Password changed. Please log in again.' });
});

module.exports = { login, refresh, logout, me, changePassword };
