import express from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import { SearchService } from '../services/SearchService'
import { validateSearchRequest, validateSearchFilters } from '../validators/search'

const router = express.Router()
const searchService = new SearchService()

// ===== ADVANCED SEARCH =====
router.get('/advanced', asyncHandler(async (req, res) => {
  const { error, value } = validateSearchRequest(req.query)
  
  if (error) {
    return res.status(400).json({
      error: 'Invalid search parameters',
      details: error.details.map(d => d.message)
    })
  }

  const results = await searchService.advancedSearch(value)
  
  res.json({
    success: true,
    data: results,
    timestamp: new Date().toISOString()
  })
}))

// ===== REAL-TIME SEARCH SUGGESTIONS =====
router.get('/suggestions', asyncHandler(async (req, res) => {
  const { q, limit = 10, userId = 'default_user' } = req.query
  
  if (!q || (q as string).length < 2) {
    return res.json({
      success: true,
      data: { suggestions: [] },
      timestamp: new Date().toISOString()
    })
  }

  const suggestions = await searchService.getSearchSuggestions(
    q as string, 
    parseInt(limit as string),
    userId as string
  )
  
  res.json({
    success: true,
    data: suggestions,
    timestamp: new Date().toISOString()
  })
}))

// ===== SEARCH WITH FILTERS =====
router.post('/filter', asyncHandler(async (req, res) => {
  const { error, value } = validateSearchFilters(req.body)
  
  if (error) {
    return res.status(400).json({
      error: 'Invalid filter parameters',
      details: error.details.map(d => d.message)
    })
  }

  const results = await searchService.searchWithFilters(value)
  
  res.json({
    success: true,
    data: results,
    timestamp: new Date().toISOString()
  })
}))

// ===== SEARCH ANALYTICS =====
router.get('/analytics', asyncHandler(async (req, res) => {
  const { userId = 'default_user', period = '30' } = req.query
  
  const analytics = await searchService.getSearchAnalytics(
    userId as string, 
    parseInt(period as string)
  )
  
  res.json({
    success: true,
    data: analytics,
    timestamp: new Date().toISOString()
  })
}))

// ===== POPULAR SEARCHES =====
router.get('/popular', asyncHandler(async (req, res) => {
  const { limit = 20, period = '7' } = req.query
  
  const popular = await searchService.getPopularSearches(
    parseInt(limit as string),
    parseInt(period as string)
  )
  
  res.json({
    success: true,
    data: popular,
    timestamp: new Date().toISOString()
  })
}))

// ===== SEARCH HISTORY =====
router.get('/history/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params
  const { limit = 50 } = req.query
  
  const history = await searchService.getSearchHistory(
    userId,
    parseInt(limit as string)
  )
  
  res.json({
    success: true,
    data: history,
    timestamp: new Date().toISOString()
  })
}))

// ===== CLEAR SEARCH HISTORY =====
router.delete('/history/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params
  
  const result = await searchService.clearSearchHistory(userId)
  
  res.json({
    success: true,
    data: result,
    message: 'Search history cleared successfully',
    timestamp: new Date().toISOString()
  })
}))

// ===== SAVE SEARCH =====
router.post('/save', asyncHandler(async (req, res) => {
  const { userId, query, filters, name } = req.body
  
  if (!userId || !query) {
    return res.status(400).json({
      error: 'User ID and query are required'
    })
  }

  const result = await searchService.saveSearch(userId, query, filters, name)
  
  res.json({
    success: true,
    data: result,
    message: 'Search saved successfully',
    timestamp: new Date().toISOString()
  })
}))

// ===== SAVED SEARCHES =====
router.get('/saved/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params
  
  const saved = await searchService.getSavedSearches(userId)
  
  res.json({
    success: true,
    data: saved,
    timestamp: new Date().toISOString()
  })
}))

// ===== DELETE SAVED SEARCH =====
router.delete('/saved/:searchId', asyncHandler(async (req, res) => {
  const { searchId } = req.params
  
  const result = await searchService.deleteSavedSearch(searchId)
  
  res.json({
    success: true,
    data: result,
    message: 'Saved search deleted successfully',
    timestamp: new Date().toISOString()
  })
}))

// ===== SEARCH INDEXING =====
router.post('/index/rebuild', asyncHandler(async (req, res) => {
  const { userId, sections } = req.body
  
  const result = await searchService.rebuildSearchIndex(userId, sections)
  
  res.json({
    success: true,
    data: result,
    message: 'Search index rebuilt successfully',
    timestamp: new Date().toISOString()
  })
}))

// ===== SEARCH EXPORT =====
router.post('/export', asyncHandler(async (req, res) => {
  const { userId, query, filters, format = 'json' } = req.body
  
  const result = await searchService.exportSearchResults(userId, query, filters, format)
  
  res.json({
    success: true,
    data: result,
    message: 'Search results exported successfully',
    timestamp: new Date().toISOString()
  })
}))

export default router
