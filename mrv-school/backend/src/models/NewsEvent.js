const mongoose = require('mongoose');
const slugify = require('slugify');

const schema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['news', 'event', 'circular', 'holiday', 'achievement'],
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    summary: { type: String },
    content: { type: String }, // sanitized HTML from the admin rich-text editor
    image: { type: String },
    imageAlt: { type: String, trim: true },
    attachmentUrl: { type: String }, // for circulars/notices PDFs
    eventDate: { type: Date, index: true },
    eventEndDate: { type: Date },
    location: { type: String },
    isPublished: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },

    // --- SEO ---
    metaTitle: { type: String, trim: true, maxlength: [120, 'Meta title is too long (max 120 chars)'] },
    metaDescription: { type: String, trim: true, maxlength: [320, 'Meta description is too long (max 320 chars)'] },
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
  },
  { timestamps: true }
);

schema.index({ type: 1, publishedAt: -1 });

// Fallback for direct Model.create() calls (seed scripts etc.) — the API
// middleware already normalizes the slug before it reaches here.
schema.pre('validate', function autoSlug(next) {
  if (!this.slug && this.title) this.slug = slugify(this.title, { lower: true, strict: true, trim: true });
  next();
});

module.exports = mongoose.model('NewsEvent', schema);
