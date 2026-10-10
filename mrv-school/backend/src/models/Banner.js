const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    // The homepage Hero renders a 3-photo collage from a single banner
    // (imageUrl = main/large photo, imageUrl2/imageUrl3 = the two smaller
    // supporting photos) rather than pulling from separate banner records —
    // that keeps "one banner" and "the 3 photos in its hero tile" the same
    // editable unit for admins.
    imageUrl: { type: String, required: true },
    imageUrl2: { type: String, trim: true },
    imageUrl3: { type: String, trim: true },
    heroType: { type: String, enum: ['default', 'banner'], default: 'default' },
    ctaText: { type: String, trim: true },
    ctaLink: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Banner', schema);
