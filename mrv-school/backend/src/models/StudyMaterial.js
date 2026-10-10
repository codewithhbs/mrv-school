const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    class: { type: String, required: true, index: true },
    section: { type: String }, // blank = applies to all sections of the class
    subject: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
schema.index({ class: 1, subject: 1 });
module.exports = mongoose.model('StudyMaterial', schema);
