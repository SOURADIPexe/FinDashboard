const User = require('../models/User');

class UserRepository {
  async create(userData) {
    return User.create(userData);
  }

  async findByEmail(email) {
    return User.findOne({ email }).select('+password');
  }

  async findById(id) {
    return User.findById(id);
  }

  async findAll({ page = 1, limit = 10, role, isActive } = {}) {
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive;

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    return {
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateById(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deactivate(id) {
    return User.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  async activate(id) {
    return User.findByIdAndUpdate(id, { isActive: true }, { new: true });
  }
}

module.exports = new UserRepository();
