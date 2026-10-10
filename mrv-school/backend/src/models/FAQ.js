const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, enum: ['admission', 'academics', 'fees', 'general'], default: 'general', index: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('FAQ', schema);
