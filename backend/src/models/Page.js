const mongoose = require('mongoose');

// Flexible block-based content page. Covers About Us subpages (Vision & Mission,
// History, Chairman's Message, Principal's Message, Leadership, Infrastructure,
// School Rules & Policies), Academics subpages, Admission info pages, etc.
const blockSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // heading, paragraph, image, list, table, quote, cta
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const schema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    group: { type: String, required: true, index: true }, // e.g. "about", "academics", "admission", "facilities"
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    heroImage: { type: String },
    blocks: { type: [blockSchema], default: [] },
    seoTitle: { type: String },
    seoDescription: { type: String },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Page', schema);
