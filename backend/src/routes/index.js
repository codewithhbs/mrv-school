const express = require('express');

const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/admission', require('./admission.routes'));
router.use('/contact', require('./contact.routes'));
router.use('/careers', require('./career.routes'));
router.use('/alumni', require('./alumni.routes'));
router.use('/settings', require('./settings.routes'));
router.use('/uploads', require('./upload.routes'));

// Parent/Student portal — separate auth namespace + data scoped to the
// logged-in account's linked student(s). See middleware/portalAuth.js.
router.use('/portal/auth', require('./portalAuth.routes'));
router.use('/portal', require('./portalData.routes'));

// Staff management of portal accounts, attendance, and other academic
// records (student PII — never exposed on the public CMS routes below).
router.use('/portal-accounts', require('./portalAccounts.routes'));
router.use('/attendance', require('./attendance.routes'));
router.use('/', require('./academic.routes')); // students, homework, study-materials, exam-schedule, results, ptm-schedule, fee-records

router.use('/', require('./cms.routes')); // banners, pages, academic-programs, facilities, faculty, news-events, gallery, testimonials, downloads, faqs, fee-structure, scholarships, alumni/stories

router.get('/health', (req, res) => res.json({ success: true, message: 'MRVPS API is healthy', time: new Date().toISOString() }));

module.exports = router;
