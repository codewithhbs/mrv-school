const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    opening: { type: mongoose.Schema.Types.ObjectId, ref: 'CareerOpening', required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    resumeUrl: { type: String, required: true },
    coverNote: { type: String },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'shortlisted', 'rejected', 'hired'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('CareerApplication', schema);
