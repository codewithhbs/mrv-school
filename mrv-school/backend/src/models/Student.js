const mongoose = require('mongoose');

// Academic record for a student. Login credentials live separately in
// PortalAccount (a parent account can link to multiple Students; a student
// account links to exactly one).
const schema = new mongoose.Schema(
  {
    admissionNo: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    class: { type: String, required: true, index: true }, // e.g. "5", "Nursery", "12"
    section: { type: String, required: true, trim: true, uppercase: true }, // e.g. "A"
    rollNo: { type: String, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    bloodGroup: { type: String },
    photo: { type: String },
    address: { type: String },
    parentName: { type: String },
    parentPhone: { type: String },
    parentEmail: { type: String, lowercase: true, trim: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

schema.index({ class: 1, section: 1 });
schema.index({ name: 'text', admissionNo: 'text' });

module.exports = mongoose.model('Student', schema);
