const express = require('express');
const { requirePortalAuth } = require('../middleware/portalAuth');
const controller = require('../controllers/portalData.controller');

const router = express.Router();

router.use(requirePortalAuth); // every route below requires a logged-in parent/student

router.get('/student', controller.getStudent);
router.get('/attendance', controller.getAttendance);
router.get('/homework', controller.getHomework);
router.get('/study-materials', controller.getStudyMaterials);
router.get('/exam-schedule', controller.getExamSchedule);
router.get('/results', controller.getResults);
router.get('/ptm-schedule', controller.getPTMSchedule);
router.get('/fee-records', controller.getFeeRecords);

module.exports = router;
