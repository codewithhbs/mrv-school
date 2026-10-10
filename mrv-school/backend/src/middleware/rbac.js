const AppError = require('../utils/AppError');

// Role hierarchy: superadmin > admin > content_editor / admissions_officer > viewer
// Usage: requireRole('admin', 'superadmin')
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    if (req.user.role === 'superadmin') return next(); // superadmin bypasses checks
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
}

// Fine-grained module gate, layered on top of requireRole. If the user has
// no `permissions` set (legacy/default), this is a no-op — the role check
// already applied is all that matters. If `permissions` is non-empty, the
// user is restricted to exactly those modules, regardless of role.
// Usage: requirePermission('banners')
function requirePermission(moduleKey) {
  return (req, res, next) => {
    if (!req.user) return next(new AppError('Authentication required', 401));
    if (req.user.role === 'superadmin') return next(); // superadmin bypasses checks
    if (Array.isArray(req.user.permissions) && req.user.permissions.length > 0) {
      if (!req.user.permissions.includes(moduleKey)) {
        return next(new AppError('You do not have permission to access this section', 403));
      }
    }
    next();
  };
}

module.exports = { requireRole, requirePermission };
