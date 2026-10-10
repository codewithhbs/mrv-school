const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['superadmin', 'admin', 'content_editor', 'admissions_officer', 'teacher', 'viewer'];

// Fine-grained module access, independent of role. Keys mirror the admin
// sidebar section slugs (see admin/lib/navConfig.js). Empty array = no extra
// restriction beyond the role-based gates already on each route (keeps
// existing accounts working exactly as before this field was introduced).
// A non-empty array RESTRICTS the user to only those modules, even if their
// role would otherwise allow more (superadmin always has full access).
const PERMISSION_MODULES = [
  'banners', 'pages', 'academic-programs', 'facilities', 'faculty', 'news-events',
  'gallery', 'testimonials', 'downloads', 'faqs', 'fee-structure', 'scholarships',
  'alumni-stories', 'career-openings', 'students', 'portal-accounts', 'attendance',
  'homework', 'study-materials', 'exam-schedule', 'results', 'ptm-schedule',
  'fee-records', 'admission-enquiries', 'contact-messages', 'career-applications',
  'alumni-registrations', 'settings', 'users',
];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: 'viewer', index: true },
    permissions: { type: [String], enum: PERMISSION_MODULES, default: [] },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    passwordChangedAt: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.methods.isLocked = function () {
  return !!(this.lockedUntil && this.lockedUntil > new Date());
};

userSchema.statics.ROLES = ROLES;
userSchema.statics.PERMISSION_MODULES = PERMISSION_MODULES;

module.exports = mongoose.model('User', userSchema);
