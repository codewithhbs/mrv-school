const AppError = require('../utils/AppError');

// Returns a public-relative URL for an uploaded file. Actual static serving
// is configured in app.js via express.static on /uploads.
const handleUpload = (req, res) => {
  if (!req.file) throw new AppError('No file uploaded', 400);
  res.status(201).json({
    success: true,
    data: {
      url: `/uploads/${req.file.filename}`,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
    },
  });
};

module.exports = { handleUpload };
