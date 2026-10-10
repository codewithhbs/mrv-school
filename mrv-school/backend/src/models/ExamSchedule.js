const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    examName: { type: String, required: true, index: true }, // e.g. "Term 1 Examination 2026"
    class: { type: String, required: true },
    section: { type: String },
    subject: { type: String, required: true },
    examDate: { type: Date, required: true },
    startTime: { type: String }, // "09:00"
    endTime: { type: String },
    room: { type: String },
    maxMarks: { type: Number, default: 100 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
schema.index({ class: 1, examName: 1, examDate: 1 });
module.exports = mongoose.model('ExamSchedule', schema);
