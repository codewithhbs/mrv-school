const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const AlumniRegistration = require('../models/AlumniRegistration');
const { logAudit } = require('../utils/audit');

const register = asyncHandler(async (req, res) => {
  const reg = await AlumniRegistration.create(req.body);
  await logAudit({ req, action: 'CREATE', resource: 'AlumniRegistration', resourceId: reg._id.toString() });
  res.status(201).json({ success: true, message: 'Registered successfully.', data: { id: reg._id } });
});

const list = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const [items, total] = await Promise.all([
    AlumniRegistration.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit),
    AlumniRegistration.countDocuments(filter),
  ]);
  res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

const updateStatus = asyncHandler(async (req, res) => {
  const item = await AlumniRegistration.findById(req.params.id);
  if (!item) throw new AppError('Registration not found', 404);
  if (req.body.status) item.status = req.body.status;
  await item.save();
  await logAudit({ req, action: 'UPDATE', resource: 'AlumniRegistration', resourceId: item._id.toString() });
  res.json({ success: true, data: item });
});

module.exports = { register, list, updateStatus };
