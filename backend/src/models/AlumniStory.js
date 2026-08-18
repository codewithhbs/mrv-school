const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    batchYear: { type: String, required: true },
    currentRole: { type: String },
    story: { type: String, required: true },
    photo: { type: String },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('AlumniStory', schema);
