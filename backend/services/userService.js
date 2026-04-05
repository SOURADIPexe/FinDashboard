const userRepository = require('../repositories/userRepository');

class UserService {
  async getAllUsers(queryParams) {
    return userRepository.findAll(queryParams);
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async updateUser(id, updateData) {
    // Prevent password update through this method
    delete updateData.password;

    const user = await userRepository.updateById(id, updateData);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async updateRole(id, role) {
    const user = await userRepository.updateById(id, { role });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async deactivateUser(id) {
    const user = await userRepository.deactivate(id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async activateUser(id) {
    const user = await userRepository.activate(id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

module.exports = new UserService();
