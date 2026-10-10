const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const CareerOpening = require('../models/CareerOpening');
const CareerApplication = require('../models/CareerApplication');
const { logAudit } = require('../utils/audit');

// POST /api/careers/:openingId/apply (public, expects resume uploaded via /api/uploads first)
const apply = asyncHandler(async (req, res) => {
  const opening = await CareerOpening.findById(req.params.openingId);
  if (!opening || !opening.isActive) throw new AppError('This opening is not available', 404);

  const { name, email, phone, resumeUrl, coverNote } = req.body;
  if (!name || !email || !phone || !resumeUrl) throw new AppError('name, email, phone, resumeUrl are required', 400);

  const application = await CareerApplication.create({
    opening: opening._id, name, email, phone, resumeUrl, coverNote,
  });
  await logAudit({ req, action: 'CREATE', resource: 'CareerApplication', resourceId: application._id.toString() });
  res.status(201).json({ success: true, message: 'Application submitted successfully.', data: { id: application._id } });
});

const listApplications = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const filter = {};
  if (req.query.opening) filter.opening = req.query.opening;
  if (req.query.status) filter.status = req.query.status;
  const [items, total] = await Promise.all([
    CareerApplication.find(filter).populate('opening', 'title department').sort('-createdAt').skip((page - 1) * limit).limit(limit),
    CareerApplication.countDocuments(filter),
  ]);
  res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const item = await CareerApplication.findById(req.params.id);
  if (!item) throw new AppError('Application not found', 404);
  if (req.body.status) item.status = req.body.status;
  await item.save();
  await logAudit({ req, action: 'UPDATE', resource: 'CareerApplication', resourceId: item._id.toString() });
  res.json({ success: true, data: item });
});

module.exports = { apply, listApplications, updateApplicationStatus };
