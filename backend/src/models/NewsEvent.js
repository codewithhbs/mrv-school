const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['news', 'event', 'circular', 'holiday', 'achievement'],
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    summary: { type: String },
    content: { type: String },
    image: { type: String },
    attachmentUrl: { type: String }, // for circulars/notices PDFs
    eventDate: { type: Date, index: true },
    eventEndDate: { type: Date },
    location: { type: String },
    isPublished: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
schema.index({ type: 1, publishedAt: -1 });
module.exports = mongoose.model('NewsEvent', schema);
