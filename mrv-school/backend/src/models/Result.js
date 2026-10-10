const mongoose = require('mongoose');

const subjectMarkSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    marksObtained: { type: Number, required: true },
    maxMarks: { type: Number, required: true, default: 100 },
    grade: { type: String },
  },
  { _id: false }
);

const schema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    examName: { type: String, required: true },
    academicYear: { type: String, required: true },
    subjects: { type: [subjectMarkSchema], default: [] },
    totalMarksObtained: { type: Number },
    totalMaxMarks: { type: Number },
    percentage: { type: Number },
    overallGrade: { type: String },
    remarks: { type: String },
    isPublished: { type: Boolean, default: false, index: true }, // hidden from portal until published
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

// Auto-compute totals/percentage before saving so the admin never has to do
// the arithmetic by hand.
schema.pre('save', function computeTotals(next) {
  if (this.subjects && this.subjects.length) {
    this.totalMarksObtained = this.subjects.reduce((sum, s) => sum + (s.marksObtained || 0), 0);
    this.totalMaxMarks = this.subjects.reduce((sum, s) => sum + (s.maxMarks || 0), 0);
    this.percentage = this.totalMaxMarks ? Number(((this.totalMarksObtained / this.totalMaxMarks) * 100).toFixed(2)) : 0;
  }
  next();
});

schema.index({ student: 1, examName: 1 }, { unique: true });
module.exports = mongoose.model('Result', schema);
