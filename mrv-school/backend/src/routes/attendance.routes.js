const express = require('express');
const { buildStaffCrudRouter } = require('../utils/routeFactory');
const { requireAuth } = require('../middleware/auth');
const { requireRole, requirePermission } = require('../middleware/rbac');
const Attendance = require('../models/Attendance');
const controller = require('../controllers/attendance.controller');

const router = express.Router();

// Class-wide marking sheet + bulk save — the primary teacher workflow.
router.get('/class', requireAuth, requireRole('admin', 'teacher'), requirePermission('attendance'), controller.listForClass);
router.post('/bulk', requireAuth, requireRole('admin', 'teacher'), requirePermission('attendance'), controller.markBulk);

// Generic single-record CRUD (edit/delete an individual entry if needed).
// Staff-only for every verb — attendance is student PII, never public.
router.use('/', buildStaffCrudRouter(Attendance, 'Attendance', {
  writeRoles: ['admin', 'teacher'],
  deleteRoles: ['admin', 'teacher'],
  populate: { path: 'student', select: 'name admissionNo class section' },
  permissionKey: 'attendance',
}));

module.exports = router;
