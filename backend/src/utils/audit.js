const AuditLog = require('../models/AuditLog');

// Fire-and-forget audit logging; failures here must never break the request.
async function logAudit({ req, action, resource, resourceId, status = 'success', meta }) {
  try {
    await AuditLog.create({
      actor: req.user ? req.user._id : undefined,
      actorEmail: req.user ? req.user.email : req.body?.email,
      action,
      resource,
      resourceId,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      meta,
      status,
    });
  } catch (err) {
    console.error('[audit] Failed to write audit log:', err.message);
  }
}

module.exports = { logAudit };
