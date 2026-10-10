const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const AppError = require('../utils/AppError');

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOC_TYPES = ['application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

const uploadDir = process.env.UPLOAD_DIR || 'src/uploads';
const maxSizeMb = Number(process.env.MAX_FILE_SIZE_MB || 10);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // Never trust the original filename directly; generate a random safe name.
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
    const safeName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
    cb(null, safeName);
  },
});

function makeFileFilter(allowedTypes) {
  return (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new AppError(`Unsupported file type: ${file.mimetype}`, 400));
    }
    cb(null, true);
  };
}

const uploadImage = multer({
  storage,
  limits: { fileSize: maxSizeMb * 1024 * 1024 },
  fileFilter: makeFileFilter(ALLOWED_IMAGE_TYPES),
});

const uploadDocument = multer({
  storage,
  limits: { fileSize: maxSizeMb * 1024 * 1024 },
  fileFilter: makeFileFilter([...ALLOWED_DOC_TYPES, ...ALLOWED_IMAGE_TYPES]),
});

const uploadMedia = multer({
  storage,
  limits: { fileSize: maxSizeMb * 1024 * 1024 * 5 }, // allow larger for video
  fileFilter: makeFileFilter([...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]),
});

module.exports = { uploadImage, uploadDocument, uploadMedia };
