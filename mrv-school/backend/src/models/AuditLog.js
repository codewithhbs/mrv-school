const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    actorEmail: { type: String },
    action: { type: String, required: true }, // e.g. "CREATE", "UPDATE", "DELETE", "LOGIN", "LOGIN_FAILED"
    resource: { type: String, required: true }, // e.g. "NewsEvent", "Auth"
    resourceId: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    meta: { type: mongoose.Schema.Types.Mixed },
    status: { type: String, enum: ['success', 'failure'], default: 'success' },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
