import express from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import { ChatbotService } from '../services/ChatbotService'
import { GoogleSheetsService } from '../services/GoogleSheetsService'
import { validateChatRequest, validateSheetsRequest } from '../validators/chatbot'

const router = express.Router()
const chatbotService = new ChatbotService()
const sheetsService = new GoogleSheetsService()

// Chat endpoint
router.post('/chat', asyncHandler(async (req, res) => {
  const { error, value } = validateChatRequest(req.body)
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    })
  }

  const { message, userId, sessionId, context } = value

  try {
    const response = await chatbotService.processMessage({
      message,
      userId: userId || 'anonymous',
      sessionId: sessionId || `session_${Date.now()}`,
      context: context || {}
    })

    res.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Chat processing error:', error)
    res.status(500).json({
      error: 'Failed to process chat message',
      message: error.message
    })
  }
}))

// Google Sheets integration endpoint
router.post('/sheets', asyncHandler(async (req, res) => {
  const { error, value } = validateSheetsRequest(req.body)
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    })
  }

  const { action, data, userId } = value

  try {
    const response = await sheetsService.sendToSheets({
      action,
      data,
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
      source: 'Blockitin AI Chatbot Backend'
    })

    res.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Google Sheets error:', error)
    res.status(500).json({
      error: 'Failed to send data to Google Sheets',
      message: error.message
    })
  }
}))

// Get chat history (placeholder)
router.get('/history/:sessionId', asyncHandler(async (req, res) => {
  const { sessionId } = req.params
  
  // This would typically fetch from a database
  const history = await chatbotService.getChatHistory(sessionId)
  
  res.json({
    success: true,
    data: {
      sessionId,
      messages: history,
      totalMessages: history.length
    },
    timestamp: new Date().toISOString()
  })
}))

// Analytics endpoint
router.get('/analytics', asyncHandler(async (req, res) => {
  const analytics = await chatbotService.getAnalytics()
  
  res.json({
    success: true,
    data: analytics,
    timestamp: new Date().toISOString()
  })
}))

// Test Google Sheets connection
router.post('/sheets/test', asyncHandler(async (req, res) => {
  try {
    const testResult = await sheetsService.testConnection()
    
    res.json({
      success: true,
      data: testResult,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Google Sheets test error:', error)
    res.status(500).json({
      error: 'Failed to test Google Sheets connection',
      message: error.message
    })
  }
}))

export default router
