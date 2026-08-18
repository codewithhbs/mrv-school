const express = require('express');
const { buildStaffCrudRouter } = require('../utils/routeFactory');

const Student = require('../models/Student');
const Homework = require('../models/Homework');
const StudyMaterial = require('../models/StudyMaterial');
const ExamSchedule = require('../models/ExamSchedule');
const Result = require('../models/Result');
const PTMSchedule = require('../models/PTMSchedule');
const FeeRecord = require('../models/FeeRecord');

const router = express.Router();

// All staff-only (student PII / academic records — never publicly listable).
router.use('/students', buildStaffCrudRouter(Student, 'Student', {
  searchFields: ['name', 'admissionNo'],
  readRoles: ['admin', 'teacher', 'admissions_officer'],
  writeRoles: ['admin', 'teacher'],
  permissionKey: 'students',
}));

router.use('/homework', buildStaffCrudRouter(Homework, 'Homework', {
  searchFields: ['title', 'subject'],
  writeRoles: ['admin', 'teacher'],
  permissionKey: 'homework',
}));

router.use('/study-materials', buildStaffCrudRouter(StudyMaterial, 'StudyMaterial', {
  searchFields: ['title', 'subject'],
  writeRoles: ['admin', 'teacher'],
  permissionKey: 'study-materials',
}));

router.use('/exam-schedule', buildStaffCrudRouter(ExamSchedule, 'ExamSchedule', {
  searchFields: ['examName', 'subject'],
  writeRoles: ['admin', 'teacher'],
  permissionKey: 'exam-schedule',
}));

router.use('/results', buildStaffCrudRouter(Result, 'Result', {
  writeRoles: ['admin', 'teacher'],
  populate: { path: 'student', select: 'name admissionNo class section' },
  permissionKey: 'results',
}));

router.use('/ptm-schedule', buildStaffCrudRouter(PTMSchedule, 'PTMSchedule', {
  writeRoles: ['admin', 'teacher'],
  permissionKey: 'ptm-schedule',
}));

router.use('/fee-records', buildStaffCrudRouter(FeeRecord, 'FeeRecord', {
  readRoles: ['admin'],
  writeRoles: ['admin'],
  populate: { path: 'student', select: 'name admissionNo class section' },
  permissionKey: 'fee-records',
}));

module.exports = router;
