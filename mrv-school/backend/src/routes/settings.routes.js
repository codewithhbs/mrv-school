const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { requireRole, requirePermission } = require('../middleware/rbac');
const controller = require('../controllers/settings.controller');

const router = express.Router();

router.get('/', controller.get); // public - needed for header/footer/contact info
router.put('/', requireAuth, requireRole('admin'), requirePermission('settings'), controller.update);

module.exports = router;
