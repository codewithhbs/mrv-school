const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    classLevel: { type: String, required: true, index: true },
    academicYear: { type: String, required: true },
    admissionFee: { type: Number, default: 0 },
    tuitionFeeAnnual: { type: Number, default: 0 },
    otherCharges: { type: [{ label: String, amount: Number }], default: [] },
    notes: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
schema.index({ classLevel: 1, academicYear: 1 }, { unique: true });
module.exports = mongoose.model('FeeStructure', schema);
