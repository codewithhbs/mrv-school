const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { sha256 } = require('./tokens');

// Separate secrets/expiries from the staff token utility on purpose — a leak
// of one secret should never let an attacker forge the other kind of session.
function signPortalAccessToken(account) {
  return jwt.sign(
    { sub: account._id.toString(), role: account.role, kind: 'portal', tokenVersion: account.passwordChangedAt || 0 },
    process.env.JWT_PORTAL_ACCESS_SECRET,
    { expiresIn: process.env.JWT_PORTAL_ACCESS_EXPIRES || '15m' }
  );
}

function signPortalRefreshToken(accountId, family) {
  const jti = crypto.randomUUID();
  const token = jwt.sign(
    { sub: accountId.toString(), family, jti, kind: 'portal' },
    process.env.JWT_PORTAL_REFRESH_SECRET,
    { expiresIn: process.env.JWT_PORTAL_REFRESH_EXPIRES || '60d' }
  );
  return { token, jti };
}

function verifyPortalAccessToken(token) {
  return jwt.verify(token, process.env.JWT_PORTAL_ACCESS_SECRET);
}

function verifyPortalRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_PORTAL_REFRESH_SECRET);
}

module.exports = { sha256, signPortalAccessToken, signPortalRefreshToken, verifyPortalAccessToken, verifyPortalRefreshToken };
