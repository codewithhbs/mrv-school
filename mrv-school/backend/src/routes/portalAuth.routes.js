const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiters');
const { requirePortalAuth } = require('../middleware/portalAuth');
const controller = require('../controllers/portalAuth.controller');

const router = express.Router();

router.post('/login', authLimiter, [body('email').isEmail(), body('password').notEmpty()], validate, controller.login);
router.post('/refresh', authLimiter, controller.refresh);
router.post('/logout', requirePortalAuth, controller.logout);
router.get('/me', requirePortalAuth, controller.me);
router.post(
  '/change-password',
  requirePortalAuth,
  [body('currentPassword').notEmpty(), body('newPassword').isLength({ min: 8 })],
  validate,
  controller.changePassword
);

module.exports = router;
