const recordService = require('../services/recordService');
const ApiResponse = require('../utils/apiResponse');

class RecordController {
  async create(req, res, next) {
    try {
      const record = await recordService.createRecord(req.body, req.user._id);
      return ApiResponse.created(res, 'Record created', record);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const result = await recordService.getRecords(req.query);
      return ApiResponse.success(res, 'Records retrieved', result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const record = await recordService.getRecordById(req.params.id);
      return ApiResponse.success(res, 'Record retrieved', record);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const record = await recordService.updateRecord(req.params.id, req.body);
      return ApiResponse.success(res, 'Record updated', record);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await recordService.deleteRecord(req.params.id);
      return ApiResponse.success(res, 'Record deleted');
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req, res, next) {
    try {
      const categories = await recordService.getCategories();
      return ApiResponse.success(res, 'Categories retrieved', categories);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecordController();
