const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    classAppliedFor: { type: String, required: true },
    parentName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String },
    message: { type: String },
    source: { type: String, default: 'website' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'in-review', 'admitted', 'rejected', 'closed'],
      default: 'new',
      index: true,
    },
    internalNotes: { type: String, select: false },
  },
  { timestamps: true }
);
schema.index({ createdAt: -1 });
module.exports = mongoose.model('AdmissionEnquiry', schema);
