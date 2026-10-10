const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    batchYear: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    currentOccupation: { type: String },
    city: { type: String },
    message: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('AlumniRegistration', schema);
