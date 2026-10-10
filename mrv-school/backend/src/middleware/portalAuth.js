const { verifyPortalAccessToken } = require('../utils/portalTokens');
const AppError = require('../utils/AppError');
const PortalAccount = require('../models/PortalAccount');
const asyncHandler = require('./asyncHandler');

// Verifies a portal (parent/student) access token and attaches req.portalUser.
// Kept entirely separate from middleware/auth.js (staff auth) — a staff Bearer
// token is never valid here and vice versa, since they're signed with
// different secrets.
const requirePortalAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new AppError('Please log in to the portal', 401);

  let payload;
  try {
    payload = verifyPortalAccessToken(token);
  } catch (err) {
    throw new AppError('Invalid or expired session', 401);
  }

  const account = await PortalAccount.findById(payload.sub).populate('students');
  if (!account || !account.isActive) throw new AppError('Account not found or deactivated', 401);

  if (account.passwordChangedAt && payload.tokenVersion) {
    const changedTime = new Date(account.passwordChangedAt).getTime();
    const tokenTime = new Date(payload.tokenVersion).getTime();
    if (changedTime > tokenTime) throw new AppError('Session expired, please log in again', 401);
  }

  req.portalUser = account;
  next();
});

// Ensures a parent/student can only ever request data for a student they're
// actually linked to — the one authorization check every portal data route
// depends on.
function assertOwnsStudent(portalUser, studentId) {
  const owns = portalUser.students.some((s) => s._id.toString() === studentId.toString());
  if (!owns) throw new AppError('You do not have access to this student\'s records', 403);
}

module.exports = { requirePortalAuth, assertOwnsStudent };
