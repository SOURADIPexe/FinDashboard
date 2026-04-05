const Joi = require('joi');

const registerSchema = {
  body: Joi.object({
    name: Joi.string().trim().max(100).required().messages({
      'string.empty': 'Name is required',
    }),
    email: Joi.string().email().lowercase().trim().required().messages({
      'string.email': 'Please provide a valid email',
    }),
    password: Joi.string().min(6).max(128).required().messages({
      'string.min': 'Password must be at least 6 characters',
    }),
    role: Joi.string().valid('Viewer', 'Analyst', 'Admin').optional(),
  }),
};

const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().required(),
  }),
};

const refreshTokenSchema = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

const createRecordSchema = {
  body: Joi.object({
    amount: Joi.number().positive().required().messages({
      'number.positive': 'Amount must be a positive number',
    }),
    type: Joi.string().valid('income', 'expense').required(),
    category: Joi.string().trim().max(100).required(),
    date: Joi.date().iso().required(),
    notes: Joi.string().trim().max(500).allow('').optional(),
  }),
};

const updateRecordSchema = {
  body: Joi.object({
    amount: Joi.number().positive().optional(),
    type: Joi.string().valid('income', 'expense').optional(),
    category: Joi.string().trim().max(100).optional(),
    date: Joi.date().iso().optional(),
    notes: Joi.string().trim().max(500).allow('').optional(),
  }).min(1),
};

const updateRoleSchema = {
  body: Joi.object({
    role: Joi.string().valid('Viewer', 'Analyst', 'Admin').required(),
  }),
};

const paginationSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('date', 'amount', 'createdAt', 'category').default('date'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    type: Joi.string().valid('income', 'expense').optional(),
    category: Joi.string().optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
  }),
};

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  createRecordSchema,
  updateRecordSchema,
  updateRoleSchema,
  paginationSchema,
};
