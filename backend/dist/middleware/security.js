"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = exports.sanitizeInput = exports.validateChatMessage = exports.authLimiter = exports.chatLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Rate limiting for API endpoints
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Stricter rate limiting for chat endpoints
exports.chatLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60000, // 1 minute
    max: 30, // limit each IP to 30 messages per minute
    message: {
        success: false,
        error: 'Too many messages, please slow down.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Rate limiting for authentication endpoints
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 900000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        success: false,
        error: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Request validation middleware
const validateChatMessage = (req, res, next) => {
    const { message, sessionId } = req.body;
    if (!message || typeof message !== 'string') {
        res.status(400).json({
            success: false,
            error: 'Message is required and must be a string'
        });
        return;
    }
    if (message.length > 1000) {
        res.status(400).json({
            success: false,
            error: 'Message is too long (max 1000 characters)'
        });
        return;
    }
    if (message.trim().length === 0) {
        res.status(400).json({
            success: false,
            error: 'Message cannot be empty'
        });
        return;
    }
    if (sessionId && typeof sessionId !== 'string') {
        res.status(400).json({
            success: false,
            error: 'Session ID must be a string'
        });
        return;
    }
    next();
};
exports.validateChatMessage = validateChatMessage;
// Request sanitization
const sanitizeInput = (req, res, next) => {
    if (req.body.message) {
        // Basic XSS protection
        req.body.message = req.body.message
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<[^>]*>?/gm, '')
            .trim();
    }
    next();
};
exports.sanitizeInput = sanitizeInput;
// CORS configuration
exports.corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
            'http://localhost:3000',
            'http://localhost:5173'
        ];
        // Allow requests with no origin (like mobile apps, Postman, etc.)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
//# sourceMappingURL=security.js.map