const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    class: { type: String, required: true },
    section: { type: String },
    date: { type: Date, required: true },
    time: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
schema.index({ class: 1, date: -1 });
module.exports = mongoose.model('PTMSchedule', schema);
