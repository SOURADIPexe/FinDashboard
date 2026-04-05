const ApiResponse = require('../utils/apiResponse');

/**
 * Creates a validation middleware using a Joi schema
 * @param {Object} schema - Joi schema object with body, query, params
 */
const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    ['body', 'query', 'params'].forEach((key) => {
      if (schema[key]) {
        const { error } = schema[key].validate(req[key], {
          abortEarly: false,
          stripUnknown: true,
        });

        if (error) {
          error.details.forEach((detail) => {
            errors.push(detail.message.replace(/"/g, ''));
          });
        }
      }
    });

    if (errors.length > 0) {
      return ApiResponse.error(res, 'Validation failed', 400, errors);
    }

    next();
  };
};

module.exports = validate;
