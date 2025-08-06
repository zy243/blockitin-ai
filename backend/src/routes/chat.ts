import { Router } from 'express';
import {
  sendMessage,
  getChatHistory,
  getUserSessions,
  createSession,
  endSession,
  analyzeIntent,
  getSystemHealth,
  initializeSheets
} from '../controllers/chatController';
import { authenticateToken } from '../middleware/auth';
import { chatLimiter, validateChatMessage, sanitizeInput } from '../middleware/security';

const router = Router();

// Apply authentication to all chat routes
router.use(authenticateToken);

// POST /api/chat/message (with rate limiting and validation)
router.post('/message', 
  chatLimiter, 
  sanitizeInput, 
  validateChatMessage, 
  sendMessage
);

// GET /api/chat/sessions
router.get('/sessions', getUserSessions);

// POST /api/chat/sessions
router.post('/sessions', createSession);

// GET /api/chat/sessions/:sessionId/history
router.get('/sessions/:sessionId/history', getChatHistory);

// PUT /api/chat/sessions/:sessionId/end
router.put('/sessions/:sessionId/end', endSession);

// POST /api/chat/analyze-intent
router.post('/analyze-intent', analyzeIntent);

// GET /api/chat/health
router.get('/health', getSystemHealth);

// POST /api/chat/initialize-sheets
router.post('/initialize-sheets', initializeSheets);

export default router;