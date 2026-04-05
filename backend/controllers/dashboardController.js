const dashboardService = require('../services/dashboardService');
const ApiResponse = require('../utils/apiResponse');

class DashboardController {
  async getSummary(req, res, next) {
    try {
      const summary = await dashboardService.getSummary();
      return ApiResponse.success(res, 'Dashboard summary retrieved', summary);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryBreakdown(req, res, next) {
    try {
      const breakdown = await dashboardService.getCategoryBreakdown();
      return ApiResponse.success(res, 'Category breakdown retrieved', breakdown);
    } catch (error) {
      next(error);
    }
  }

  async getTrends(req, res, next) {
    try {
      const { period } = req.query;
      const trends = await dashboardService.getTrends(period);
      return ApiResponse.success(res, 'Trends retrieved', trends);
    } catch (error) {
      next(error);
    }
  }

  async getRecentActivity(req, res, next) {
    try {
      const { limit } = req.query;
      const activity = await dashboardService.getRecentActivity(Number(limit) || 10);
      return ApiResponse.success(res, 'Recent activity retrieved', activity);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
