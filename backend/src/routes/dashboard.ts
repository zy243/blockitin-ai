import express from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import { DashboardService } from '../services/DashboardService'
import { 
  validateCredentialRequest, 
  validateHealthRequest, 
  validateAssignmentRequest,
  validateAttendanceRequest,
  validatePublishingRequest,
  validateWalletRequest,
  validateMapRequest,
  validateResumeRequest,
  validateResultsRequest
} from '../validators/dashboard'

const router = express.Router()
const dashboardService = new DashboardService()

// ===== DASHBOARD OVERVIEW =====
router.get('/overview', asyncHandler(async (req, res) => {
  const { userId = 'default_user' } = req.query
  
  const overview = await dashboardService.getDashboardOverview(userId as string)
  
  res.json({
    success: true,
    data: overview,
    timestamp: new Date().toISOString()
  })
}))

// ===== NFT CREDENTIALS =====
router.get('/credentials', asyncHandler(async (req, res) => {
  const { userId = 'default_user' } = req.query
  
  const credentials = await dashboardService.getCredentials(userId as string)
  
  res.json({
    success: true,
    data: credentials,
    timestamp: new Date().toISOString()
  })
}))

router.post('/credentials/mint', asyncHandler(async (req, res) => {
  const { error, value } = validateCredentialRequest(req.body)
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    })
  }

  const result = await dashboardService.mintCredential(value)
  
  res.json({
    success: true,
    data: result,
    message: 'NFT Credential minted successfully',
    timestamp: new Date().toISOString()
  })
}))

router.get('/credentials/:id/verify', asyncHandler(async (req, res) => {
  const { id } = req.params
  
  const verification = await dashboardService.verifyCredential(id)
  
  res.json({
    success: true,
    data: verification,
    timestamp: new Date().toISOString()
  })
}))

// ===== AI RESUME BUILDER =====
router.get('/resume', asyncHandler(async (req, res) => {
  const { userId = 'default_user' } = req.query
  
  const resume = await dashboardService.getResume(userId as string)
  
  res.json({
    success: true,
    data: resume,
    timestamp: new Date().toISOString()
  })
}))

router.post('/resume/generate', asyncHandler(async (req, res) => {
  const { error, value } = validateResumeRequest(req.body)
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    })
  }

  const result = await dashboardService.generateResume(value)
  
  res.json({
    success: true,
    data: result,
    message: 'AI Resume generated successfully',
    timestamp: new Date().toISOString()
  })
}))

router.post('/resume/optimize', asyncHandler(async (req, res) => {
  const { userId, jobDescription, resumeData } = req.body
  
  const optimized = await dashboardService.optimizeResume(userId, jobDescription, resumeData)
  
  res.json({
    success: true,
    data: optimized,
    message: 'Resume optimized for job posting',
    timestamp: new Date().toISOString()
  })
}))

// ===== HEALTH PASSPORT =====
router.get('/health', asyncHandler(async (req, res) => {
  const { userId = 'default_user' } = req.query
  
  const health = await dashboardService.getHealthRecords(userId as string)
  
  res.json({
    success: true,
    data: health,
    timestamp: new Date().toISOString()
  })
}))

router.post('/health/upload', asyncHandler(async (req, res) => {
  const { error, value } = validateHealthRequest(req.body)
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    })
  }

  const result = await dashboardService.uploadHealthRecord(value)
  
  res.json({
    success: true,
    data: result,
    message: 'Health record uploaded successfully',
    timestamp: new Date().toISOString()
  })
}))

router.post('/health/share', asyncHandler(async (req, res) => {
  const { recordId, shareWith, permissions } = req.body
  
  const result = await dashboardService.shareHealthRecord(recordId, shareWith, permissions)
  
  res.json({
    success: true,
    data: result,
    message: 'Health record shared successfully',
    timestamp: new Date().toISOString()
  })
}))

router.get('/health/wellness-score', asyncHandler(async (req, res) => {
  const { userId = 'default_user' } = req.query
  
  const score = await dashboardService.calculateWellnessScore(userId as string)
  
  res.json({
    success: true,
    data: score,
    timestamp: new Date().toISOString()
  })
}))

// ===== MOOD & WELLNESS TRACKER =====
router.get('/wellness', asyncHandler(async (req, res) => {
  const { userId = 'default_user', period = '30' } = req.query
  
  const wellness = await dashboardService.getWellnessData(userId as string, parseInt(period as string))
  
  res.json({
    success: true,
    data: wellness,
    timestamp: new Date().toISOString()
  })
}))

router.post('/wellness/checkin', asyncHandler(async (req, res) => {
  const { userId, mood, energy, stress, sleep, notes } = req.body
  
  const result = await dashboardService.recordWellnessCheckin({
    userId,
    mood,
    energy,
    stress,
    sleep,
    notes
  })
  
  res.json({
    success: true,
    data: result,
    message: 'Wellness check-in recorded',
    timestamp: new Date().toISOString()
  })
}))

// ===== ATTENDANCE LOG =====
router.get('/attendance', asyncHandler(async (req, res) => {
  const { userId = 'default_user', semester = 'current' } = req.query
  
  const attendance = await dashboardService.getAttendanceLog(userId as string, semester as string)
  
  res.json({
    success: true,
    data: attendance,
    timestamp: new Date().toISOString()
  })
}))

router.post('/attendance/checkin', asyncHandler(async (req, res) => {
  const { error, value } = validateAttendanceRequest(req.body)
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    })
  }

  const result = await dashboardService.recordAttendance(value)
  
  res.json({
    success: true,
    data: result,
    message: 'Attendance recorded successfully',
    timestamp: new Date().toISOString()
  })
}))

// ===== ACADEMIC PUBLISHING =====
router.get('/publishing', asyncHandler(async (req, res) => {
  const { userId = 'default_user' } = req.query
  
  const publications = await dashboardService.getPublications(userId as string)
  
  res.json({
    success: true,
    data: publications,
    timestamp: new Date().toISOString()
  })
}))

router.post('/publishing/submit', asyncHandler(async (req, res) => {
  const { error, value } = validatePublishingRequest(req.body)
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    })
  }

  const result = await dashboardService.submitPublication(value)
  
  res.json({
    success: true,
    data: result,
    message: 'Publication submitted successfully',
    timestamp: new Date().toISOString()
  })
}))

// ===== WALLET CONNECTION =====
router.get('/wallet', asyncHandler(async (req, res) => {
  const { userId = 'default_user' } = req.query
  
  const wallet = await dashboardService.getWalletInfo(userId as string)
  
  res.json({
    success: true,
    data: wallet,
    timestamp: new Date().toISOString()
  })
}))

router.post('/wallet/connect', asyncHandler(async (req, res) => {
  const { error, value } = validateWalletRequest(req.body)
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    })
  }

  const result = await dashboardService.connectWallet(value)
  
  res.json({
    success: true,
    data: result,
    message: 'Wallet connected successfully',
    timestamp: new Date().toISOString()
  })
}))

// ===== ASSIGNMENT TRACKER =====
router.get('/assignments', asyncHandler(async (req, res) => {
  const { userId = 'default_user', status = 'all' } = req.query
  
  const assignments = await dashboardService.getAssignments(userId as string, status as string)
  
  res.json({
    success: true,
    data: assignments,
    timestamp: new Date().toISOString()
  })
}))

router.post('/assignments', asyncHandler(async (req, res) => {
  const { error, value } = validateAssignmentRequest(req.body)
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    })
  }

  const result = await dashboardService.createAssignment(value)
  
  res.json({
    success: true,
    data: result,
    message: 'Assignment created successfully',
    timestamp: new Date().toISOString()
  })
}))

router.put('/assignments/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  const updates = req.body
  
  const result = await dashboardService.updateAssignment(id, updates)
  
  res.json({
    success: true,
    data: result,
    message: 'Assignment updated successfully',
    timestamp: new Date().toISOString()
  })
}))

// ===== CAMPUS MAP =====
router.get('/map/locations', asyncHandler(async (req, res) => {
  const { category = 'all' } = req.query
  
  const locations = await dashboardService.getCampusLocations(category as string)
  
  res.json({
    success: true,
    data: locations,
    timestamp: new Date().toISOString()
  })
}))

router.post('/map/navigate', asyncHandler(async (req, res) => {
  const { error, value } = validateMapRequest(req.body)
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    })
  }

  const result = await dashboardService.getNavigation(value)
  
  res.json({
    success: true,
    data: result,
    message: 'Navigation route calculated',
    timestamp: new Date().toISOString()
  })
}))

// ===== ACADEMIC RESULTS =====
router.get('/results', asyncHandler(async (req, res) => {
  const { userId = 'default_user', semester = 'all' } = req.query
  
  const results = await dashboardService.getAcademicResults(userId as string, semester as string)
  
  res.json({
    success: true,
    data: results,
    timestamp: new Date().toISOString()
  })
}))

router.post('/results/calculate-gpa', asyncHandler(async (req, res) => {
  const { userId, semester } = req.body
  
  const gpa = await dashboardService.calculateGPA(userId, semester)
  
  res.json({
    success: true,
    data: gpa,
    timestamp: new Date().toISOString()
  })
}))

router.get('/results/transcript/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params
  const { format = 'pdf' } = req.query
  
  const transcript = await dashboardService.generateTranscript(userId, format as string)
  
  res.json({
    success: true,
    data: transcript,
    message: 'Transcript generated successfully',
    timestamp: new Date().toISOString()
  })
}))

// ===== SEARCH FUNCTIONALITY =====
router.get('/search', asyncHandler(async (req, res) => {
  const { q, category = 'all', userId = 'default_user' } = req.query
  
  if (!q) {
    return res.status(400).json({
      error: 'Search query is required',
      message: 'Please provide a search query parameter "q"'
    })
  }

  const results = await dashboardService.searchDashboard(q as string, category as string, userId as string)
  
  res.json({
    success: true,
    data: results,
    query: q,
    category,
    timestamp: new Date().toISOString()
  })
}))

// ===== ANALYTICS & REPORTING =====
router.get('/analytics', asyncHandler(async (req, res) => {
  const { userId = 'default_user', period = '30' } = req.query
  
  const analytics = await dashboardService.getDashboardAnalytics(userId as string, parseInt(period as string))
  
  res.json({
    success: true,
    data: analytics,
    timestamp: new Date().toISOString()
  })
}))

router.post('/export', asyncHandler(async (req, res) => {
  const { userId, sections, format = 'json' } = req.body
  
  const exportData = await dashboardService.exportDashboardData(userId, sections, format)
  
  res.json({
    success: true,
    data: exportData,
    message: 'Dashboard data exported successfully',
    timestamp: new Date().toISOString()
  })
}))

export default router
