const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['admission-form', 'prospectus', 'holiday-list', 'academic-calendar', 'tc-form', 'certificate', 'other'],
      required: true,
      index: true,
    },
    fileUrl: { type: String, required: true },
    fileType: { type: String }, // pdf, docx, etc
    fileSizeKb: { type: Number },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('DownloadItem', schema);
