const mongoose = require('mongoose');

// Singleton document: site-wide settings (logo, contact info, socials, SEO defaults)
const schema = new mongoose.Schema(
  {
    key: { type: String, default: 'singleton', unique: true },
    schoolName: { type: String, default: 'M.R. Vivekananda Public School' },
    tagline: { type: String },
    logoUrl: { type: String },
    faviconUrl: { type: String },
    address: { type: String },
    phones: { type: [String], default: [] },
    emails: { type: [String], default: [] },
    officeHours: { type: String },
    mapEmbedUrl: { type: String },
    mapLat: { type: Number },
    mapLng: { type: Number },
    socialLinks: {
      facebook: String,
      instagram: String,
      youtube: String,
      twitter: String,
      linkedin: String,
    },
    affiliationNumber: { type: String },
    board: { type: String, default: 'CBSE' },
    heroType: { type: String, enum: ['default', 'banner'], default: 'default' },
    seoDefaultTitle: { type: String },
    seoDefaultDescription: { type: String },
    footerText: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model('SchoolSettings', schema);
