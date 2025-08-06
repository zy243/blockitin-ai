import express from 'express'
import { asyncHandler } from '../middleware/errorHandler'

const router = express.Router()

router.get('/', asyncHandler(async (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    services: {
      database: 'not_implemented',
      googleSheets: process.env.GOOGLE_APPS_SCRIPT_URL ? 'configured' : 'not_configured',
      redis: 'not_implemented'
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      external: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100
    }
  }

  res.json(healthCheck)
}))

router.get('/ping', asyncHandler(async (req, res) => {
  res.json({ 
    message: 'pong',
    timestamp: new Date().toISOString()
  })
}))

export default router
