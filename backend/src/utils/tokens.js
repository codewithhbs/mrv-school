const crypto = require('crypto');
const jwt = require('jsonwebtoken');

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, tokenVersion: user.passwordChangedAt || 0 },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
  );
}

function signRefreshToken(userId, family) {
  const jti = crypto.randomUUID();
  const token = jwt.sign(
    { sub: userId.toString(), family, jti },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '30d' }
  );
  return { token, jti };
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

module.exports = { sha256, signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken };
