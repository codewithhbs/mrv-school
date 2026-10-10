const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    department: { type: String },
    employmentType: { type: String, enum: ['full-time', 'part-time', 'contract'], default: 'full-time' },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    applyDeadline: { type: Date },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('CareerOpening', schema);
