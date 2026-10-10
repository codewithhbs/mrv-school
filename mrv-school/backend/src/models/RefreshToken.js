const mongoose = require('mongoose');

// Refresh tokens are stored only as SHA-256 hashes (never plaintext).
// Enables rotation + theft detection: if a used/revoked token hash is
// presented again, all tokens in that family are revoked.
const refreshTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    family: { type: String, required: true, index: true }, // rotation family id
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
    replacedByHash: { type: String },
    userAgent: { type: String },
    ip: { type: String },
  },
  { timestamps: true }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
