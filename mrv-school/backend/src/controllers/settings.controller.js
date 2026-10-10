const asyncHandler = require('../middleware/asyncHandler');
const SchoolSettings = require('../models/SchoolSettings');
const { logAudit } = require('../utils/audit');

const get = asyncHandler(async (req, res) => {
  let settings = await SchoolSettings.findOne({ key: 'singleton' });
  if (!settings) settings = await SchoolSettings.create({ key: 'singleton' });
  res.json({ success: true, data: settings });
});

const update = asyncHandler(async (req, res) => {
  const settings = await SchoolSettings.findOneAndUpdate(
    { key: 'singleton' },
    { $set: req.body },
    { new: true, upsert: true, runValidators: true }
  );
  await logAudit({ req, action: 'UPDATE', resource: 'SchoolSettings', resourceId: settings._id.toString() });
  res.json({ success: true, data: settings });
});

module.exports = { get, update };
