const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const { logAudit } = require('./audit');

// Generic CRUD controller factory for simple CMS resources.
// Keeps controllers consistent (pagination, filtering, audit logging) without
// duplicating boilerplate across ~15 similar modules.
function crudFactory(Model, resourceName, options = {}) {
  const { searchFields = [], defaultSort = '-createdAt', populate } = options;

  const list = asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search && searchFields.length) {
      filter.$or = searchFields.map((f) => ({ [f]: { $regex: req.query.search, $options: 'i' } }));
    }
    // Allow simple equality filters via ?filter[field]=value
    if (req.query.filter && typeof req.query.filter === 'object') {
      Object.assign(filter, req.query.filter);
    }

    let query = Model.find(filter).sort(defaultSort).skip(skip).limit(limit);
    if (populate) query = query.populate(populate);

    const [items, total] = await Promise.all([query, Model.countDocuments(filter)]);

    res.json({
      success: true,
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  });

  const getOne = asyncHandler(async (req, res) => {
    let query = Model.findById(req.params.id);
    if (populate) query = query.populate(populate);
    const item = await query;
    if (!item) throw new AppError(`${resourceName} not found`, 404);
    res.json({ success: true, data: item });
  });

  const create = asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    await logAudit({ req, action: 'CREATE', resource: resourceName, resourceId: item._id.toString() });
    res.status(201).json({ success: true, data: item });
  });

  const update = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) throw new AppError(`${resourceName} not found`, 404);
    await logAudit({ req, action: 'UPDATE', resource: resourceName, resourceId: item._id.toString() });
    res.json({ success: true, data: item });
  });

  const remove = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) throw new AppError(`${resourceName} not found`, 404);
    await logAudit({ req, action: 'DELETE', resource: resourceName, resourceId: req.params.id });
    res.json({ success: true, message: `${resourceName} deleted` });
  });

  return { list, getOne, create, update, remove };
}

module.exports = crudFactory;
