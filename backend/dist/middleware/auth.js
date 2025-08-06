"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Access token required'
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Get user from database
        const user = await models_1.User.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Invalid token - user not found'
            });
            return;
        }
        req.user = {
            id: user._id.toString(),
            email: user.email,
            name: user.name
        };
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(403).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await models_1.User.findById(decoded.id).select('-password');
            if (user) {
                req.user = {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name
                };
            }
        }
        next();
    }
    catch (error) {
        // Continue without user context if token is invalid
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map