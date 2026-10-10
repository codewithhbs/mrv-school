const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiters');
const { requireAuth } = require('../middleware/auth');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post(
  '/login',
  authLimiter,
  [body('email').isEmail().withMessage('Valid email required'), body('password').notEmpty()],
  validate,
  authController.login
);

router.post('/refresh', authLimiter, authController.refresh);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.me);
router.post(
  '/change-password',
  requireAuth,
  [body('currentPassword').notEmpty(), body('newPassword').isLength({ min: 10 })],
  validate,
  authController.changePassword
);

module.exports = router;
