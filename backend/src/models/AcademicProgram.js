const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    level: {
      type: String,
      required: true,
      enum: ['pre-primary', 'primary', 'middle', 'secondary', 'senior-secondary'],
      index: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    ageGroup: { type: String },
    highlights: { type: [String], default: [] },
    subjects: { type: [String], default: [] },
    image: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('AcademicProgram', schema);
