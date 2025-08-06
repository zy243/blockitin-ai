"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("../controllers/chatController");
const auth_1 = require("../middleware/auth");
const security_1 = require("../middleware/security");
const router = (0, express_1.Router)();
// Apply authentication to all chat routes
router.use(auth_1.authenticateToken);
// POST /api/chat/message (with rate limiting and validation)
router.post('/message', security_1.chatLimiter, security_1.sanitizeInput, security_1.validateChatMessage, chatController_1.sendMessage);
// GET /api/chat/sessions
router.get('/sessions', chatController_1.getUserSessions);
// POST /api/chat/sessions
router.post('/sessions', chatController_1.createSession);
// GET /api/chat/sessions/:sessionId/history
router.get('/sessions/:sessionId/history', chatController_1.getChatHistory);
// PUT /api/chat/sessions/:sessionId/end
router.put('/sessions/:sessionId/end', chatController_1.endSession);
// POST /api/chat/analyze-intent
router.post('/analyze-intent', chatController_1.analyzeIntent);
// GET /api/chat/health
router.get('/health', chatController_1.getSystemHealth);
// POST /api/chat/initialize-sheets
router.post('/initialize-sheets', chatController_1.initializeSheets);
exports.default = router;
//# sourceMappingURL=chat.js.map