const bcrypt = require('bcryptjs');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const User = require('../models/User');
const { logAudit } = require('../utils/audit');

// Admin-user management (superadmin/admin only). Distinct from any public
// "student/parent" auth, which this school site does not require for MVP.

const list = asyncHandler(async (req, res) => {
  const users = await User.find().sort('-createdAt');
  res.json({ success: true, data: users });
});

const create = asyncHandler(async (req, res) => {
  const { name, email, password, role, permissions } = req.body;
  if (!name || !email || !password || !role) throw new AppError('name, email, password, role are required', 400);
  if (!User.ROLES.includes(role)) throw new AppError('Invalid role', 400);
  if (password.length < 10) throw new AppError('Password must be at least 10 characters', 400);

  let perms = [];
  if (permissions !== undefined) {
    if (!Array.isArray(permissions)) throw new AppError('permissions must be an array', 400);
    if (permissions.some((p) => !User.PERMISSION_MODULES.includes(p))) throw new AppError('Invalid permission module', 400);
    perms = permissions;
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new AppError('A user with this email already exists', 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email: email.toLowerCase(), passwordHash, role, permissions: perms });

  await logAudit({ req, action: 'CREATE', resource: 'User', resourceId: user._id.toString() });
  res.status(201).json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role, permissions: user.permissions } });
});

const update = asyncHandler(async (req, res) => {
  const { name, role, isActive, permissions } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);

  if (role) {
    if (!User.ROLES.includes(role)) throw new AppError('Invalid role', 400);
    if (user.role === 'superadmin' && role !== 'superadmin' && req.user.role !== 'superadmin') {
      throw new AppError('Only a superadmin can change a superadmin role', 403);
    }
    user.role = role;
  }
  if (permissions !== undefined) {
    if (!Array.isArray(permissions)) throw new AppError('permissions must be an array', 400);
    if (permissions.some((p) => !User.PERMISSION_MODULES.includes(p))) throw new AppError('Invalid permission module', 400);
    user.permissions = permissions;
  }
  if (typeof name === 'string') user.name = name;
  if (typeof isActive === 'boolean') user.isActive = isActive;

  await user.save();
  await logAudit({ req, action: 'UPDATE', resource: 'User', resourceId: user._id.toString() });
  res.json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive, permissions: user.permissions } });
});

const remove = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  if (user.role === 'superadmin') throw new AppError('Cannot delete a superadmin account', 403);
  if (user._id.equals(req.user._id)) throw new AppError('You cannot delete your own account', 400);

  await user.deleteOne();
  await logAudit({ req, action: 'DELETE', resource: 'User', resourceId: req.params.id });
  res.json({ success: true, message: 'User deleted' });
});

module.exports = { list, create, update, remove };
