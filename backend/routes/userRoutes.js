const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser, authorizeRoles } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { updateRoleSchema } = require('../utils/validationSchemas');

// All routes require Admin role
router.use(authenticateUser, authorizeRoles('Admin'));

// GET /api/users
router.get('/', userController.getAllUsers);

// GET /api/users/:id
router.get('/:id', userController.getUserById);

// PUT /api/users/:id
router.put('/:id', userController.updateUser);

// PATCH /api/users/:id/role
router.patch('/:id/role', validate(updateRoleSchema), userController.updateRole);

// PATCH /api/users/:id/deactivate
router.patch('/:id/deactivate', userController.deactivateUser);

// PATCH /api/users/:id/activate
router.patch('/:id/activate', userController.activateUser);

module.exports = router;
