const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const { authenticateUser, authorizeRoles } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createRecordSchema, updateRecordSchema, paginationSchema } = require('../utils/validationSchemas');

// All routes require authentication
router.use(authenticateUser);

// GET /api/records — All authenticated users
router.get('/', validate(paginationSchema), recordController.getAll);

// GET /api/records/categories — All authenticated users
router.get('/categories', recordController.getCategories);

// GET /api/records/:id — All authenticated users
router.get('/:id', recordController.getById);

// POST /api/records — Analyst + Admin
router.post('/', authorizeRoles('Analyst', 'Admin'), validate(createRecordSchema), recordController.create);

// PUT /api/records/:id — Analyst + Admin
router.put('/:id', authorizeRoles('Analyst', 'Admin'), validate(updateRecordSchema), recordController.update);

// DELETE /api/records/:id — Admin only
router.delete('/:id', authorizeRoles('Admin'), recordController.delete);

module.exports = router;
