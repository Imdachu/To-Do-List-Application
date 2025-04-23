const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  dueDate: Joi.date().greater('now').optional(),
  status: Joi.string().valid('pending', 'completed').default('pending'),
  category: Joi.string().valid('Work', 'Personal', 'Shopping', 'Other').default('Other')
});

const taskUpdateSchema = taskSchema.fork(['title', 'dueDate'], schema => schema.optional());

// Combined schema for query: pagination + filters
const taskQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('pending', 'completed'),
  category: Joi.string().valid('Work', 'Personal', 'Shopping', 'Other'),
  fromDate: Joi.date().iso(),
  toDate: Joi.date().iso().greater(Joi.ref('fromDate')),
  sortBy: Joi.string().valid('dueDate', '-dueDate', 'createdAt', '-createdAt')
}).with('toDate', 'fromDate'); // If toDate is provided, fromDate is required

module.exports = {
  validateTask: (data) => taskSchema.validate(data),
  validateTaskUpdate: (data) => taskUpdateSchema.validate(data),
  validateTaskQuery: (data) => taskQuerySchema.validate(data, { abortEarly: false }) // return all validation errors
};
