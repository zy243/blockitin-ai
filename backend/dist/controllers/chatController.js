"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSheets = exports.getSystemHealth = exports.analyzeIntent = exports.endSession = exports.createSession = exports.getUserSessions = exports.getChatHistory = exports.sendMessage = void 0;
const ChatbotService_1 = require("../services/ChatbotService");
const chatbotService = new ChatbotService_1.ChatbotService();
const sendMessage = async (req, res) => {
    try {
        const { message, sessionId, academicData } = req.body;
        const userId = req.user.id;
        let activeSessionId = sessionId;
        // Create new session if none provided
        if (!activeSessionId) {
            activeSessionId = await chatbotService.createChatSession(userId, req.headers['user-agent'], req.ip);
        }
        // Process the message
        const result = await chatbotService.processMessage(userId, activeSessionId, message, { academicData });
        res.json({
            success: true,
            data: {
                sessionId: activeSessionId,
                messageId: result.messageId,
                response: {
                    content: result.botResponse.content,
                    suggestions: result.botResponse.suggestions,
                    action: result.botResponse.action,
                    sheetsSync: result.botResponse.sheetsAction
                },
                sheetsResponse: result.sheetsResponse
            }
        });
    }
    catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process message'
        });
    }
};
exports.sendMessage = sendMessage;
const getChatHistory = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { limit = '50' } = req.query;
        const userId = req.user.id;
        const messages = await chatbotService.getChatHistory(userId, sessionId, parseInt(limit));
        res.json({
            success: true,
            data: {
                messages,
                sessionId,
                count: messages.length
            }
        });
    }
    catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve chat history'
        });
    }
};
exports.getChatHistory = getChatHistory;
const getUserSessions = async (req, res) => {
    try {
        const userId = req.user.id;
        const sessions = await chatbotService.getUserSessions(userId);
        res.json({
            success: true,
            data: {
                sessions,
                count: sessions.length
            }
        });
    }
    catch (error) {
        console.error('Get user sessions error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve user sessions'
        });
    }
};
exports.getUserSessions = getUserSessions;
const createSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const sessionId = await chatbotService.createChatSession(userId, req.headers['user-agent'], req.ip);
        res.status(201).json({
            success: true,
            data: {
                sessionId,
                message: 'Chat session created successfully'
            }
        });
    }
    catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create chat session'
        });
    }
};
exports.createSession = createSession;
const endSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        await chatbotService.endChatSession(sessionId);
        res.json({
            success: true,
            message: 'Chat session ended successfully'
        });
    }
    catch (error) {
        console.error('End session error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to end chat session'
        });
    }
};
exports.endSession = endSession;
const analyzeIntent = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            res.status(400).json({
                success: false,
                error: 'Message is required'
            });
            return;
        }
        const analysis = await chatbotService.analyzeUserIntent(message);
        res.json({
            success: true,
            data: analysis
        });
    }
    catch (error) {
        console.error('Analyze intent error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to analyze intent'
        });
    }
};
exports.analyzeIntent = analyzeIntent;
const getSystemHealth = async (req, res) => {
    try {
        const health = await chatbotService.getSystemHealth();
        const overallHealth = Object.values(health).every(status => status);
        res.json({
            success: true,
            data: {
                ...health,
                overall: overallHealth,
                timestamp: new Date().toISOString()
            }
        });
    }
    catch (error) {
        console.error('Get system health error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check system health'
        });
    }
};
exports.getSystemHealth = getSystemHealth;
const initializeSheets = async (req, res) => {
    try {
        const result = await chatbotService.initializeGoogleSheetsStructure();
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        console.error('Initialize sheets error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to initialize Google Sheets structure'
        });
    }
};
exports.initializeSheets = initializeSheets;
//# sourceMappingURL=chatController.js.map