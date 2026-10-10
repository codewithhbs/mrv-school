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
    // Main rich-text body (HTML from the admin editor, sanitized in middleware/richText.js)
    content: { type: String, default: '' },
    blocks: { type: [blockSchema], default: [] },
    // --- SEO ---
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    focusKeyword: { type: String, trim: true },
    metaKeywords: { type: [String], default: [] },
    canonicalUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^(https?:\/\/[^\s]+|\/[^\s]*)$/i.test(v),
        message: 'Canonical URL must be a full URL (https://...) or a path starting with /',
      },
    },
    ogImage: { type: String },
    noIndex: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Page', schema);
