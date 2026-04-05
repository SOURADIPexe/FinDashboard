const recordRepository = require('../repositories/recordRepository');

class RecordService {
  async createRecord(recordData, userId) {
    return recordRepository.create({ ...recordData, createdBy: userId });
  }

  async getRecords(queryParams) {
    return recordRepository.findAll(queryParams);
  }

  async getRecordById(id) {
    const record = await recordRepository.findById(id);
    if (!record) {
      const error = new Error('Record not found');
      error.statusCode = 404;
      throw error;
    }
    return record;
  }

  async updateRecord(id, updateData) {
    const record = await recordRepository.updateById(id, updateData);
    if (!record) {
      const error = new Error('Record not found');
      error.statusCode = 404;
      throw error;
    }
    return record;
  }

  async deleteRecord(id) {
    const record = await recordRepository.softDelete(id);
    if (!record) {
      const error = new Error('Record not found');
      error.statusCode = 404;
      throw error;
    }
    return record;
  }

  async getCategories() {
    return recordRepository.getCategories();
  }
}

module.exports = new RecordService();
