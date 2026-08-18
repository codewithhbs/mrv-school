const express = require('express');
const { formLimiter } = require('../middleware/rateLimiters');
const { requireAuth } = require('../middleware/auth');
const { requireRole, requirePermission } = require('../middleware/rbac');
const controller = require('../controllers/alumni.controller');

const router = express.Router();

router.post('/register', formLimiter, controller.register);
router.get('/registrations', requireAuth, requireRole('admin'), requirePermission('alumni-registrations'), controller.list);
router.put('/registrations/:id', requireAuth, requireRole('admin'), requirePermission('alumni-registrations'), controller.updateStatus);

module.exports = router;
