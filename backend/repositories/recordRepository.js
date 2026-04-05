const FinancialRecord = require('../models/FinancialRecord');

class RecordRepository {
  async create(recordData) {
    return FinancialRecord.create(recordData);
  }

  async findById(id) {
    return FinancialRecord.findOne({ _id: id, isDeleted: false }).populate('createdBy', 'name email');
  }

  async findAll({ page = 1, limit = 10, sortBy = 'date', order = 'desc', type, category, startDate, endDate, createdBy } = {}) {
    const query = { isDeleted: false };

    if (type) query.type = type;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (createdBy) query.createdBy = createdBy;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      FinancialRecord.find(query)
        .populate('createdBy', 'name email')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      FinancialRecord.countDocuments(query),
    ]);

    return {
      records,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateById(id, updateData) {
    return FinancialRecord.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
  }

  async softDelete(id) {
    return FinancialRecord.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  async getCategories() {
    return FinancialRecord.distinct('category', { isDeleted: false });
  }
}

module.exports = new RecordRepository();
