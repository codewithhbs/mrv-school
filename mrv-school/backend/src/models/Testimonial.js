const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['parent', 'student', 'alumni'], required: true },
    content: { type: String, required: true },
    photo: { type: String },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Testimonial', schema);
