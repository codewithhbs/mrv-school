const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    class: { type: String, required: true },
    section: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'leave', 'half-day'], required: true },
    remarks: { type: String },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
schema.index({ student: 1, date: 1 }, { unique: true }); // one record per student per day
schema.index({ class: 1, section: 1, date: 1 });
module.exports = mongoose.model('Attendance', schema);
