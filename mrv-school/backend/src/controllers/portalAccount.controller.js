const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const PortalAccount = require('../models/PortalAccount');
const PortalRefreshToken = require('../models/PortalRefreshToken');
const { logAudit } = require('../utils/audit');

// Staff-facing management of parent/student portal accounts (create, reset
// password, activate/deactivate, link students). Distinct from
// portalAuth.controller.js, which is the parent/student's own login flow.

function generateTempPassword() {
  return crypto.randomBytes(6).toString('base64url'); // ~8 url-safe chars
}

const list = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  const [items, total] = await Promise.all([
    PortalAccount.find(filter).populate('students', 'name admissionNo class section').sort('-createdAt').skip((page - 1) * limit).limit(limit),
    PortalAccount.countDocuments(filter),
  ]);
  res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

// POST /portal-accounts — admin creates a parent/student login, gets a temp
// password back once (never retrievable again — same principle as staff
// account creation).
const create = asyncHandler(async (req, res) => {
  const { role, name, email, phone, students } = req.body;
  if (!role || !name || !email || !students?.length) {
    throw new AppError('role, name, email, and at least one student are required', 400);
  }
  if (role === 'student' && students.length !== 1) {
    throw new AppError('A student account must link to exactly one student', 400);
  }

  const existing = await PortalAccount.findOne({ email: email.toLowerCase() });
  if (existing) throw new AppError('An account with this email already exists', 409);

  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 12);

  const account = await PortalAccount.create({
    role, name, email: email.toLowerCase(), phone, students, passwordHash, mustChangePassword: true,
  });

  await logAudit({ req, action: 'CREATE', resource: 'PortalAccount', resourceId: account._id.toString() });

  res.status(201).json({
    success: true,
    data: { id: account._id, name: account.name, email: account.email, role: account.role, tempPassword },
    message: 'Account created. Share the temporary password with the family through a secure channel — it will not be shown again.',
  });
});

const update = asyncHandler(async (req, res) => {
  const account = await PortalAccount.findById(req.params.id);
  if (!account) throw new AppError('Account not found', 404);

  const { name, phone, students, isActive } = req.body;
  if (typeof name === 'string') account.name = name;
  if (typeof phone === 'string') account.phone = phone;
  if (Array.isArray(students)) account.students = students;
  if (typeof isActive === 'boolean') account.isActive = isActive;

  await account.save();
  await logAudit({ req, action: 'UPDATE', resource: 'PortalAccount', resourceId: account._id.toString() });
  res.json({ success: true, data: account });
});

// POST /portal-accounts/:id/reset-password — admin-initiated reset (no email
// service is configured in this project; the temp password is returned once
// for staff to relay to the family directly).
const resetPassword = asyncHandler(async (req, res) => {
  const account = await PortalAccount.findById(req.params.id);
  if (!account) throw new AppError('Account not found', 404);

  const tempPassword = generateTempPassword();
  account.passwordHash = await bcrypt.hash(tempPassword, 12);
  account.passwordChangedAt = new Date();
  account.mustChangePassword = true;
  await account.save();

  await PortalRefreshToken.updateMany({ account: account._id, revokedAt: null }, { revokedAt: new Date() });
  await logAudit({ req, action: 'PASSWORD_RESET', resource: 'PortalAccount', resourceId: account._id.toString() });

  res.json({ success: true, data: { tempPassword }, message: 'Password reset. Share it with the family through a secure channel.' });
});

const remove = asyncHandler(async (req, res) => {
  const account = await PortalAccount.findByIdAndDelete(req.params.id);
  if (!account) throw new AppError('Account not found', 404);
  await logAudit({ req, action: 'DELETE', resource: 'PortalAccount', resourceId: req.params.id });
  res.json({ success: true, message: 'Account deleted' });
});

module.exports = { list, create, update, resetPassword, remove };
