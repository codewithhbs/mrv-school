const express = require('express');
const crudFactory = require('./crudFactory');
const { requireAuth } = require('../middleware/auth');
const { requireRole, requirePermission } = require('../middleware/rbac');

// Builds a standard REST router for a CMS resource:
//   GET    /            (public)
//   GET    /:id         (public)
//   POST   /            (auth + role [+ permission])
//   PUT    /:id         (auth + role [+ permission])
//   DELETE /:id         (auth + role [+ permission], defaults to admin/superadmin only)
// Pass `permissionKey` (matching admin/lib/navConfig.js section slugs) to
// additionally gate write access by the logged-in user's `permissions` list.
function buildCrudRouter(Model, resourceName, options = {}) {
  const router = express.Router();
  const controller = crudFactory(Model, resourceName, options);
  const writeRoles = options.writeRoles || ['admin', 'content_editor'];
  const deleteRoles = options.deleteRoles || ['admin'];
  const permGate = options.permissionKey ? [requirePermission(options.permissionKey)] : [];

  router.get('/', controller.list);
  router.get('/:id', controller.getOne);
  router.post('/', requireAuth, requireRole(...writeRoles), ...permGate, controller.create);
  router.put('/:id', requireAuth, requireRole(...writeRoles), ...permGate, controller.update);
  router.delete('/:id', requireAuth, requireRole(...deleteRoles), ...permGate, controller.remove);

  return router;
}

// Same shape as buildCrudRouter, but EVERY route (including GET) requires
// staff auth + role [+ permission]. Use this for anything containing student
// PII — academic records must never be publicly listable, unlike marketing
// content (banners, facilities, etc.) which buildCrudRouter is designed for.
function buildStaffCrudRouter(Model, resourceName, options = {}) {
  const router = express.Router();
  const controller = crudFactory(Model, resourceName, options);
  const readRoles = options.readRoles || options.writeRoles || ['admin', 'teacher'];
  const writeRoles = options.writeRoles || ['admin', 'teacher'];
  const deleteRoles = options.deleteRoles || ['admin'];
  const permGate = options.permissionKey ? [requirePermission(options.permissionKey)] : [];

  router.use(requireAuth);
  if (permGate.length) router.use(...permGate);
  router.get('/', requireRole(...readRoles), controller.list);
  router.get('/:id', requireRole(...readRoles), controller.getOne);
  router.post('/', requireRole(...writeRoles), controller.create);
  router.put('/:id', requireRole(...writeRoles), controller.update);
  router.delete('/:id', requireRole(...deleteRoles), controller.remove);

  return router;
}

module.exports = buildCrudRouter;
module.exports.buildStaffCrudRouter = buildStaffCrudRouter;
