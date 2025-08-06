"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
// Import utilities and middleware
const database_1 = require("./utils/database");
const security_1 = require("./middleware/security");
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const chat_1 = __importDefault(require("./routes/chat"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const server = (0, http_1.createServer)(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: security_1.corsOptions
});
exports.io = io;
const PORT = process.env.PORT || 5000;
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"]
        }
    }
}));
// CORS middleware
app.use((0, cors_1.default)(security_1.corsOptions));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Logging middleware
app.use((0, morgan_1.default)('combined'));
// Rate limiting
app.use('/api', security_1.apiLimiter);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Blockitin Chatbot API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
// API routes
app.use('/api/auth', auth_1.default);
app.use('/api/chat', chat_1.default);
// WebSocket handling for real-time chat
io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);
    // Join user to their own room for private messages
    socket.on('join-user-room', (userId) => {
        socket.join(`user-${userId}`);
        console.log(`👤 User ${userId} joined their room`);
    });
    // Handle real-time chat messages
    socket.on('chat-message', async (data) => {
        try {
            // Here you could process the message through your chatbot service
            // and emit the response back to the user
            console.log('📨 Received chat message:', data);
            // Emit response back to user's room
            socket.to(`user-${data.userId}`).emit('bot-response', {
                messageId: data.messageId,
                response: 'Real-time response processed',
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('❌ Error processing real-time message:', error);
            socket.emit('error', { message: 'Failed to process message' });
        }
    });
    // Handle typing indicators
    socket.on('typing-start', (data) => {
        socket.to(`user-${data.userId}`).emit('bot-typing', true);
    });
    socket.on('typing-stop', (data) => {
        socket.to(`user-${data.userId}`).emit('bot-typing', false);
    });
    socket.on('disconnect', () => {
        console.log(`🔌 User disconnected: ${socket.id}`);
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found'
    });
});
// Global error handler
app.use((error, req, res, next) => {
    console.error('❌ Global error handler:', error);
    res.status(error.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : error.message
    });
});
// Start server
const startServer = async () => {
    try {
        // Connect to database
        await (0, database_1.connectDatabase)();
        // Start HTTP server
        server.listen(PORT, () => {
            console.log(`
🚀 Blockitin Chatbot Backend Server Started!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server: http://localhost:${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📊 Health Check: http://localhost:${PORT}/health
🔐 Auth API: http://localhost:${PORT}/api/auth
💬 Chat API: http://localhost:${PORT}/api/chat
🔌 WebSocket: ws://localhost:${PORT}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to serve chatbot requests! 🤖✨
      `);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('📦 SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('📦 HTTP server closed');
        process.exit(0);
    });
});
// Start the server
if (require.main === module) {
    startServer();
}
//# sourceMappingURL=server.js.map