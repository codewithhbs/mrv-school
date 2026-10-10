const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    subject: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'read', 'responded', 'closed'], default: 'new', index: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('ContactMessage', schema);
