import Joi from 'joi'

export const validateChatRequest = (data: any) => {
  const schema = Joi.object({
    message: Joi.string().required().min(1).max(1000),
    userId: Joi.string().optional().default('anonymous'),
    sessionId: Joi.string().optional(),
    context: Joi.object().optional()
  })

  return schema.validate(data)
}

export const validateSheetsRequest = (data: any) => {
  const schema = Joi.object({
    action: Joi.string().required().min(1).max(100),
    data: Joi.object().required(),
    userId: Joi.string().optional().default('anonymous')
  })

  return schema.validate(data)
}
