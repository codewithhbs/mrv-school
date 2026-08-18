const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Login credentials for the Parents Corner / Students Corner portal.
// Distinct from the staff `User` model on purpose: different token secrets,
// different cookie, different password-reset flow, and this collection is
// expected to be orders of magnitude larger than staff accounts.
const schema = new mongoose.Schema(
  {
    role: { type: String, enum: ['parent', 'student'], required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true, select: false },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }],
    mustChangePassword: { type: Boolean, default: true }, // true after admin-created/reset accounts
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    passwordChangedAt: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
  },
  { timestamps: true }
);

schema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};
schema.methods.isLocked = function () {
  return !!(this.lockedUntil && this.lockedUntil > new Date());
};

module.exports = mongoose.model('PortalAccount', schema);
