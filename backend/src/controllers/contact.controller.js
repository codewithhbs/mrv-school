const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const ContactMessage = require('../models/ContactMessage');
const { logAudit } = require('../utils/audit');

const submitMessage = asyncHandler(async (req, res) => {
  const msg = await ContactMessage.create(req.body);
  await logAudit({ req, action: 'CREATE', resource: 'ContactMessage', resourceId: msg._id.toString() });
  res.status(201).json({ success: true, message: 'Message sent successfully.', data: { id: msg._id } });
});

const listMessages = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const [items, total] = await Promise.all([
    ContactMessage.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit),
    ContactMessage.countDocuments(filter),
  ]);
  res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

const updateMessageStatus = asyncHandler(async (req, res) => {
  const item = await ContactMessage.findById(req.params.id);
  if (!item) throw new AppError('Message not found', 404);
  if (req.body.status) item.status = req.body.status;
  await item.save();
  await logAudit({ req, action: 'UPDATE', resource: 'ContactMessage', resourceId: item._id.toString() });
  res.json({ success: true, data: item });
});

module.exports = { submitMessage, listMessages, updateMessageStatus };
