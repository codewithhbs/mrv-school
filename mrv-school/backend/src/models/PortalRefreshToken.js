const mongoose = require('mongoose');

// Mirrors RefreshToken but for PortalAccount, kept as a separate collection
// so a portal-session compromise can never touch staff sessions and vice versa.
const schema = new mongoose.Schema(
  {
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'PortalAccount', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    family: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
    replacedByHash: { type: String },
    userAgent: { type: String },
    ip: { type: String },
  },
  { timestamps: true }
);
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('PortalRefreshToken', schema);
