const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { requireRole, requirePermission } = require('../middleware/rbac');
const controller = require('../controllers/portalAccount.controller');

const router = express.Router();

router.use(requireAuth, requireRole('admin'), requirePermission('portal-accounts')); // staff-only

router.get('/', controller.list);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.post('/:id/reset-password', controller.resetPassword);
router.delete('/:id', controller.remove);

module.exports = router;
