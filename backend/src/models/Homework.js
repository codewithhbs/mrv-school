const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    class: { type: String, required: true, index: true },
    section: { type: String, required: true },
    subject: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    attachmentUrl: { type: String },
    dueDate: { type: Date, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
schema.index({ class: 1, section: 1, dueDate: -1 });
module.exports = mongoose.model('Homework', schema);
