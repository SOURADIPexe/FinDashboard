const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateUser, authorizeRoles } = require('../middlewares/auth');

// All dashboard routes require Analyst or Admin role
router.use(authenticateUser, authorizeRoles('Analyst', 'Admin'));

// GET /api/dashboard/summary
router.get('/summary', dashboardController.getSummary);

// GET /api/dashboard/category-breakdown
router.get('/category-breakdown', dashboardController.getCategoryBreakdown);

// GET /api/dashboard/trends
router.get('/trends', dashboardController.getTrends);

// GET /api/dashboard/recent-activity
router.get('/recent-activity', dashboardController.getRecentActivity);

module.exports = router;
