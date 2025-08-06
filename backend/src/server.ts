import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Import utilities and middleware
import { connectDatabase } from './utils/database';
import { corsOptions, apiLimiter } from './middleware/security';

// Import routes
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: corsOptions
});

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
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
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// Rate limiting
app.use('/api', apiLimiter);

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
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// WebSocket handling for real-time chat
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // Join user to their own room for private messages
  socket.on('join-user-room', (userId: string) => {
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
    } catch (error) {
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
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  });
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();
    
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

  } catch (error) {
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

export { app, server, io };