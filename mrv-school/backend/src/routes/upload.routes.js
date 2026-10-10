const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { uploadImage, uploadDocument, uploadMedia } = require('../middleware/upload');
const { handleUpload } = require('../controllers/upload.controller');

const router = express.Router();

// Image uploads (banners, gallery photos, faculty photos, etc.) - admin only
router.post('/image', requireAuth, requireRole('admin', 'content_editor'), uploadImage.single('file'), handleUpload);

// Document uploads (downloads section: PDFs, forms) - admin only
router.post('/document', requireAuth, requireRole('admin', 'content_editor'), uploadDocument.single('file'), handleUpload);

// Media uploads (gallery videos) - admin only
router.post('/media', requireAuth, requireRole('admin', 'content_editor'), uploadMedia.single('file'), handleUpload);

// Public resume upload for career applications (no auth - it's a public form)
router.post('/resume', uploadDocument.single('file'), handleUpload);

module.exports = router;
