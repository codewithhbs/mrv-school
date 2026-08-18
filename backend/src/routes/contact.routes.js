const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { formLimiter } = require('../middleware/rateLimiters');
const { requireAuth } = require('../middleware/auth');
const { requireRole, requirePermission } = require('../middleware/rbac');
const controller = require('../controllers/contact.controller');

const router = express.Router();

router.post(
  '/',
  formLimiter,
  [body('name').trim().notEmpty(), body('email').isEmail(), body('message').trim().notEmpty()],
  validate,
  controller.submitMessage
);

router.get('/', requireAuth, requireRole('admin'), requirePermission('contact-messages'), controller.listMessages);
router.put('/:id', requireAuth, requireRole('admin'), requirePermission('contact-messages'), controller.updateMessageStatus);

module.exports = router;
