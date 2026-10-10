const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { formLimiter } = require('../middleware/rateLimiters');
const { requireAuth } = require('../middleware/auth');
const { requireRole, requirePermission } = require('../middleware/rbac');
const controller = require('../controllers/admission.controller');

const router = express.Router();

router.post(
  '/enquiries',
  formLimiter,
  [
    body('studentName').trim().notEmpty(),
    body('classAppliedFor').trim().notEmpty(),
    body('parentName').trim().notEmpty(),
    body('email').isEmail(),
    body('phone').trim().isLength({ min: 7, max: 15 }),
  ],
  validate,
  controller.submitEnquiry
);

router.get('/enquiries', requireAuth, requireRole('admin', 'admissions_officer'), requirePermission('admission-enquiries'), controller.listEnquiries);
router.get('/enquiries/:id', requireAuth, requireRole('admin', 'admissions_officer'), requirePermission('admission-enquiries'), controller.getEnquiry);
router.put('/enquiries/:id', requireAuth, requireRole('admin', 'admissions_officer'), requirePermission('admission-enquiries'), controller.updateEnquiryStatus);

module.exports = router;
