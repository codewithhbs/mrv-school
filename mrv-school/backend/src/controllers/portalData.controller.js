const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const { assertOwnsStudent } = require('../middleware/portalAuth');
const Attendance = require('../models/Attendance');
const Homework = require('../models/Homework');
const StudyMaterial = require('../models/StudyMaterial');
const ExamSchedule = require('../models/ExamSchedule');
const Result = require('../models/Result');
const PTMSchedule = require('../models/PTMSchedule');
const FeeRecord = require('../models/FeeRecord');
const Student = require('../models/Student');

// Every endpoint here requires `?studentId=` and verifies the logged-in
// portal account actually owns that student before returning anything —
// see middleware/portalAuth.js#assertOwnsStudent. This is the only
// authorization boundary that matters for portal data.

function requireStudentId(req) {
  const { studentId } = req.query;
  if (!studentId) throw new AppError('studentId query parameter is required', 400);
  assertOwnsStudent(req.portalUser, studentId);
  return studentId;
}

const getStudent = asyncHandler(async (req, res) => {
  const studentId = requireStudentId(req);
  const student = await Student.findById(studentId);
  if (!student) throw new AppError('Student not found', 404);
  res.json({ success: true, data: student });
});

const getAttendance = asyncHandler(async (req, res) => {
  const studentId = requireStudentId(req);
  const filter = { student: studentId };
  if (req.query.month) {
    // month as "2026-08"
    const [y, m] = req.query.month.split('-').map(Number);
    filter.date = { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) };
  }
  const records = await Attendance.find(filter).sort('-date').limit(200);
  const total = records.length;
  const present = records.filter((r) => r.status === 'present').length;
  res.json({
    success: true,
    data: records,
    summary: { total, present, percentage: total ? Number(((present / total) * 100).toFixed(1)) : null },
  });
});

const getHomework = asyncHandler(async (req, res) => {
  const studentId = requireStudentId(req);
  const student = await Student.findById(studentId);
  if (!student) throw new AppError('Student not found', 404);
  const items = await Homework.find({ class: student.class, section: student.section, isActive: true })
    .sort('-dueDate')
    .limit(50);
  res.json({ success: true, data: items });
});

const getStudyMaterials = asyncHandler(async (req, res) => {
  const studentId = requireStudentId(req);
  const student = await Student.findById(studentId);
  if (!student) throw new AppError('Student not found', 404);
  const items = await StudyMaterial.find({
    class: student.class,
    isActive: true,
    $or: [{ section: student.section }, { section: { $in: [null, ''] } }],
  }).sort('-createdAt').limit(100);
  res.json({ success: true, data: items });
});

const getExamSchedule = asyncHandler(async (req, res) => {
  const studentId = requireStudentId(req);
  const student = await Student.findById(studentId);
  if (!student) throw new AppError('Student not found', 404);
  const items = await ExamSchedule.find({
    class: student.class,
    isActive: true,
    $or: [{ section: student.section }, { section: { $in: [null, ''] } }],
  }).sort('examDate').limit(100);
  res.json({ success: true, data: items });
});

const getResults = asyncHandler(async (req, res) => {
  const studentId = requireStudentId(req);
  const items = await Result.find({ student: studentId, isPublished: true }).sort('-publishedAt').limit(50);
  res.json({ success: true, data: items });
});

const getPTMSchedule = asyncHandler(async (req, res) => {
  const studentId = requireStudentId(req);
  const student = await Student.findById(studentId);
  if (!student) throw new AppError('Student not found', 404);
  const items = await PTMSchedule.find({
    class: student.class,
    isActive: true,
    $or: [{ section: student.section }, { section: { $in: [null, ''] } }],
  }).sort('-date').limit(50);
  res.json({ success: true, data: items });
});

const getFeeRecords = asyncHandler(async (req, res) => {
  const studentId = requireStudentId(req);
  const items = await FeeRecord.find({ student: studentId }).sort('-dueDate').limit(50);
  res.json({ success: true, data: items });
});

module.exports = {
  getStudent, getAttendance, getHomework, getStudyMaterials,
  getExamSchedule, getResults, getPTMSchedule, getFeeRecords,
};
