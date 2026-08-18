const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const AdmissionEnquiry = require('../models/AdmissionEnquiry');
const { logAudit } = require('../utils/audit');

// POST /api/admission/enquiries  (public)
const submitEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await AdmissionEnquiry.create(req.body);
  await logAudit({ req, action: 'CREATE', resource: 'AdmissionEnquiry', resourceId: enquiry._id.toString() });
  res.status(201).json({ success: true, message: 'Enquiry submitted successfully. Our team will contact you soon.', data: { id: enquiry._id } });
});

// GET /api/admission/enquiries  (admin/admissions_officer)
const listEnquiries = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [items, total] = await Promise.all([
    AdmissionEnquiry.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit),
    AdmissionEnquiry.countDocuments(filter),
  ]);
  res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

const getEnquiry = asyncHandler(async (req, res) => {
  const item = await AdmissionEnquiry.findById(req.params.id).select('+internalNotes');
  if (!item) throw new AppError('Enquiry not found', 404);
  res.json({ success: true, data: item });
});

const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { status, internalNotes } = req.body;
  const item = await AdmissionEnquiry.findById(req.params.id);
  if (!item) throw new AppError('Enquiry not found', 404);
  if (status) item.status = status;
  if (typeof internalNotes === 'string') item.internalNotes = internalNotes;
  await item.save();
  await logAudit({ req, action: 'UPDATE', resource: 'AdmissionEnquiry', resourceId: item._id.toString() });
  res.json({ success: true, data: item });
});

module.exports = { submitEnquiry, listEnquiries, getEnquiry, updateEnquiryStatus };
