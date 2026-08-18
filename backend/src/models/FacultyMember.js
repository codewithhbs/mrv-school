const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true },
    category: {
      type: String,
      enum: ['leadership', 'teaching', 'administrative'],
      required: true,
      index: true,
    },
    department: { type: String },
    qualification: { type: String },
    bio: { type: String },
    photo: { type: String },
    email: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('FacultyMember', schema);
