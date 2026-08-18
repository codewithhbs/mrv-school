const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { requireRole, requirePermission } = require('../middleware/rbac');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.use(requireAuth, requireRole('admin'), requirePermission('users')); // superadmin bypasses via rbac middleware

router.get('/', userController.list);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);

module.exports = router;
