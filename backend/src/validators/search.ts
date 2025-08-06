import Joi from 'joi'

export const validateSearchRequest = (data: any) => {
  const schema = Joi.object({
    q: Joi.string().required().min(1).max(200),
    userId: Joi.string().default('default_user'),
    sections: Joi.array().items(Joi.string().valid(
      'credentials', 'resume', 'health', 'wellness', 'attendance', 
      'publishing', 'wallet', 'assignments', 'map', 'results'
    )).default([]),
    sortBy: Joi.string().valid('relevance', 'date', 'popularity').default('relevance'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    limit: Joi.number().min(1).max(100).default(20),
    offset: Joi.number().min(0).default(0),
    dateRange: Joi.object({
      from: Joi.date().iso(),
      to: Joi.date().iso().min(Joi.ref('from'))
    }).optional()
  })

  return schema.validate(data)
}

export const validateSearchFilters = (data: any) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    query: Joi.string().allow('').max(200),
    sections: Joi.array().items(Joi.string().valid(
      'credentials', 'resume', 'health', 'wellness', 'attendance', 
      'publishing', 'wallet', 'assignments', 'map', 'results'
    )).default([]),
    types: Joi.array().items(Joi.string().valid(
      'credential', 'certification', 'degree', 'assignment', 'health', 
      'vaccination', 'checkup', 'publication', 'resume', 'location', 
      'grade', 'course', 'attendance'
    )).default([]),
    dateRange: Joi.object({
      from: Joi.date().iso().required(),
      to: Joi.date().iso().min(Joi.ref('from')).required()
    }).optional(),
    status: Joi.array().items(Joi.string().valid(
      'active', 'completed', 'pending', 'verified', 'draft', 
      'published', 'in_progress', 'not_started'
    )).optional(),
    priority: Joi.array().items(Joi.string().valid('low', 'medium', 'high')).optional(),
    tags: Joi.array().items(Joi.string().max(50)).optional(),
    authors: Joi.array().items(Joi.string().max(100)).optional(),
    institutions: Joi.array().items(Joi.string().max(100)).optional(),
    limit: Joi.number().min(1).max(100).default(50),
    offset: Joi.number().min(0).default(0)
  })

  return schema.validate(data)
}

export const validateSaveSearchRequest = (data: any) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    query: Joi.string().required().min(1).max(200),
    filters: Joi.object().optional(),
    name: Joi.string().max(100).optional()
  })

  return schema.validate(data)
}

export const validateExportRequest = (data: any) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    query: Joi.string().required().min(1).max(200),
    filters: Joi.object().optional(),
    format: Joi.string().valid('json', 'csv', 'xlsx', 'pdf').default('json')
  })

  return schema.validate(data)
}
