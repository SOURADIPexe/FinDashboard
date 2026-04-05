const userService = require('../services/userService');
const ApiResponse = require('../utils/apiResponse');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const result = await userService.getAllUsers(req.query);
      return ApiResponse.success(res, 'Users retrieved', result);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      return ApiResponse.success(res, 'User retrieved', user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      return ApiResponse.success(res, 'User updated', user);
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req, res, next) {
    try {
      const { role } = req.body;
      const user = await userService.updateRole(req.params.id, role);
      return ApiResponse.success(res, 'Role updated', user);
    } catch (error) {
      next(error);
    }
  }

  async deactivateUser(req, res, next) {
    try {
      const user = await userService.deactivateUser(req.params.id);
      return ApiResponse.success(res, 'User deactivated', user);
    } catch (error) {
      next(error);
    }
  }

  async activateUser(req, res, next) {
    try {
      const user = await userService.activateUser(req.params.id);
      return ApiResponse.success(res, 'User activated', user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
