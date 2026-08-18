const mongoose = require('mongoose');

const mediaItemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['photo', 'video'], required: true },
    url: { type: String, required: true },
    thumbnail: { type: String },
    caption: { type: String },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, trim: true }, // e.g. Annual Day, Sports Meet, Campus Tour
    coverImage: { type: String },
    items: { type: [mediaItemSchema], default: [] },
    isVirtualTour: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);
module.exports = mongoose.model('GalleryAlbum', schema);
