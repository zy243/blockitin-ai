import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler'
import { validateApiKey } from './middleware/auth'
import chatbotRoutes from './routes/chatbot'
import dashboardRoutes from './routes/dashboard'
import searchRoutes from './routes/search'
import healthRoutes from './routes/health'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression middleware
app.use(compression())

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Health check route (no auth required)
app.use('/api/health', healthRoutes)

// API routes with authentication
app.use('/api/chatbot', validateApiKey, chatbotRoutes)
app.use('/api/dashboard', validateApiKey, dashboardRoutes)
app.use('/api/search', validateApiKey, searchRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Blockitin AI Backend - Full Dashboard, Search & Chatbot API',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      health: '/api/health',
      chatbot: '/api/chatbot',
      dashboard: '/api/dashboard',
      search: '/api/search',
      sections: {
        overview: '/api/dashboard/overview',
        credentials: '/api/dashboard/credentials',
        resume: '/api/dashboard/resume',
        health: '/api/dashboard/health',
        wellness: '/api/dashboard/wellness',
        attendance: '/api/dashboard/attendance',
        publishing: '/api/dashboard/publishing',
        wallet: '/api/dashboard/wallet',
        assignments: '/api/dashboard/assignments',
        map: '/api/dashboard/map',
        results: '/api/dashboard/results',
        analytics: '/api/dashboard/analytics'
      },
      search: {
        advanced: '/api/search/advanced',
        suggestions: '/api/search/suggestions',
        filter: '/api/search/filter',
        analytics: '/api/search/analytics',
        popular: '/api/search/popular',
        history: '/api/search/history/:userId',
        saved: '/api/search/saved/:userId',
        export: '/api/search/export'
      }
    },
    documentation: 'https://docs.blockitin.ai/api'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: ['/api/health', '/api/chatbot', '/api/dashboard', '/api/search']
  })
})

// Error handling middleware
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Blockitin AI Backend running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV}`)
  console.log(`🔗 CORS Origin: ${process.env.CORS_ORIGIN}`)
  console.log(`📋 Google Apps Script: ${process.env.GOOGLE_APPS_SCRIPT_URL ? 'Connected' : 'Not configured'}`)
  console.log(`🎯 Dashboard API: Full coverage for all 11 sections`)
  console.log(`🔍 Search API: Advanced search with analytics and filtering`)
  console.log(`💬 Chatbot API: Active with Google Sheets integration`)
  console.log(`⚡ Server ready at http://localhost:${PORT}`)
})

export default app
