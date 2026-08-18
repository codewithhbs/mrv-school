const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    eligibility: { type: String },
    discountPercent: { type: Number },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);
module.exports = mongoose.model('ScholarshipInfo', schema);
