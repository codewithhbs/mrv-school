const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const Attendance = require('../models/Attendance');
const { logAudit } = require('../utils/audit');

// GET /attendance?class=&section=&date=  — staff view of a class's attendance
// for one day (used to render the marking sheet).
const listForClass = asyncHandler(async (req, res) => {
  const { class: cls, section, date } = req.query;
  if (!cls || !section || !date) throw new AppError('class, section, and date are required', 400);
  const day = new Date(date);
  const items = await Attendance.find({
    class: cls, section,
    date: { $gte: new Date(day.setHours(0, 0, 0, 0)), $lt: new Date(day.setHours(23, 59, 59, 999)) },
  }).populate('student', 'name admissionNo rollNo');
  res.json({ success: true, data: items });
});

// POST /attendance/bulk — mark/update attendance for a whole class in one call.
// body: { class, section, date, records: [{ studentId, status, remarks }] }
const markBulk = asyncHandler(async (req, res) => {
  const { class: cls, section, date, records } = req.body;
  if (!cls || !section || !date || !Array.isArray(records) || !records.length) {
    throw new AppError('class, section, date, and a non-empty records array are required', 400);
  }

  const ops = records.map((r) => ({
    updateOne: {
      filter: { student: r.studentId, date: new Date(date) },
      update: {
        $set: {
          student: r.studentId, class: cls, section, date: new Date(date),
          status: r.status, remarks: r.remarks, markedBy: req.user._id,
        },
      },
      upsert: true,
    },
  }));

  await Attendance.bulkWrite(ops);
  await logAudit({ req, action: 'BULK_MARK', resource: 'Attendance', meta: { class: cls, section, date, count: records.length } });
  res.json({ success: true, message: `Attendance recorded for ${records.length} student(s)` });
});

module.exports = { listForClass, markBulk };
