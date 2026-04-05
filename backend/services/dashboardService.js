const FinancialRecord = require('../models/FinancialRecord');

class DashboardService {
  /**
   * Get total income, total expense, and net balance
   */
  async getSummary() {
    const result = await FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
          },
          totalRecords: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpense: 1,
          netBalance: { $subtract: ['$totalIncome', '$totalExpense'] },
          totalRecords: 1,
        },
      },
    ]);

    return result[0] || { totalIncome: 0, totalExpense: 0, netBalance: 0, totalRecords: 0 };
  }

  /**
   * Get income/expense breakdown per category
   */
  async getCategoryBreakdown() {
    return FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id.category',
          type: '$_id.type',
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);
  }

  /**
   * Get monthly/weekly trends
   */
  async getTrends(period = 'monthly') {
    const groupByDate =
      period === 'weekly'
        ? { year: { $isoWeekYear: '$date' }, week: { $isoWeek: '$date' } }
        : { year: { $year: '$date' }, month: { $month: '$date' } };

    return FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { ...groupByDate, type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          period: '$_id',
          type: '$_id.type',
          total: 1,
          count: 1,
        },
      },
      { $sort: { 'period.year': 1, 'period.month': 1, 'period.week': 1 } },
    ]);
  }

  /**
   * Get recent activity (last 10 records)
   */
  async getRecentActivity(limit = 10) {
    return FinancialRecord.find({ isDeleted: false })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}

module.exports = new DashboardService();
