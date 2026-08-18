const express = require('express');
const buildCrudRouter = require('../utils/routeFactory');
const { formLimiter } = require('../middleware/rateLimiters');
const { requireAuth } = require('../middleware/auth');
const { requireRole, requirePermission } = require('../middleware/rbac');
const CareerOpening = require('../models/CareerOpening');
const controller = require('../controllers/career.controller');

const router = express.Router();

// Openings CRUD (admin managed, public read)
router.use('/openings', buildCrudRouter(CareerOpening, 'CareerOpening', { searchFields: ['title', 'department'], permissionKey: 'career-openings' }));

// Applications
router.post('/:openingId/apply', formLimiter, controller.apply);
router.get('/applications', requireAuth, requireRole('admin'), requirePermission('career-applications'), controller.listApplications);
router.put('/applications/:id', requireAuth, requireRole('admin'), requirePermission('career-applications'), controller.updateApplicationStatus);

module.exports = router;
