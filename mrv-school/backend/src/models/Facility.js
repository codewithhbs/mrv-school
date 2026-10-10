const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true }, // e.g. Smart Classrooms, Labs, Sports, Transport
    description: { type: String, required: true },
    icon: { type: String },
    images: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Facility', schema);
