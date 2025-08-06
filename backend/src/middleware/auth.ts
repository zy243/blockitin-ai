import { Request, Response, NextFunction } from 'express'
import { createError } from './errorHandler'

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '')
  
  if (!apiKey) {
    return next(createError('API key is required', 401))
  }

  if (apiKey !== process.env.API_KEY) {
    return next(createError('Invalid API key', 403))
  }

  next()
}
