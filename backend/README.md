# Blockitin AI Backend - Complete Dashboard & Chatbot API

A comprehensive Node.js backend supporting all dashboard functions and chatbot features with Google Sheets integration.

## 🚀 Features

### Dashboard API (11 Complete Sections)
- **NFT Credentials** - Mint, verify, and manage blockchain credentials
- **AI Resume Builder** - Generate and optimize resumes with AI
- **Health Passport** - Secure health record management
- **Mood & Wellness Tracker** - Mental health and wellness monitoring
- **Attendance Log** - Academic attendance tracking
- **Academic Publishing** - Research paper submission and management
- **Wallet Connection** - Blockchain wallet integration
- **Assignment Tracker** - Academic assignment management
- **Campus Map** - Interactive campus navigation
- **Academic Results** - Grade and transcript management
- **Search & Analytics** - Comprehensive search and reporting

### Chatbot API
- **Intelligent Chat Processing** - Context-aware responses
- **Google Sheets Integration** - Real-time data synchronization
- **Session Management** - Chat history and analytics
- **Command Recognition** - Navigation and action commands

## 📋 API Endpoints

### Dashboard Overview
```
GET  /api/dashboard/overview          # Dashboard statistics and recent activity
GET  /api/dashboard/search           # Search across all sections
GET  /api/dashboard/analytics        # Usage analytics and insights
POST /api/dashboard/export           # Export dashboard data
```

### NFT Credentials
```
GET  /api/dashboard/credentials              # Get all credentials
POST /api/dashboard/credentials/mint         # Mint new NFT credential
GET  /api/dashboard/credentials/:id/verify   # Verify credential
```

### AI Resume Builder
```
GET  /api/dashboard/resume           # Get resume data
POST /api/dashboard/resume/generate  # Generate AI resume
POST /api/dashboard/resume/optimize  # Optimize for job posting
```

### Health Passport
```
GET  /api/dashboard/health                    # Get health records
POST /api/dashboard/health/upload            # Upload health record
POST /api/dashboard/health/share             # Share health record
GET  /api/dashboard/health/wellness-score    # Calculate wellness score
```

### Mood & Wellness Tracker
```
GET  /api/dashboard/wellness         # Get wellness data
POST /api/dashboard/wellness/checkin # Record wellness check-in
```

### Attendance Log
```
GET  /api/dashboard/attendance        # Get attendance records
POST /api/dashboard/attendance/checkin # Record attendance
```

### Academic Publishing
```
GET  /api/dashboard/publishing        # Get publications
POST /api/dashboard/publishing/submit # Submit publication
```

### Wallet Connection
```
GET  /api/dashboard/wallet         # Get wallet info
POST /api/dashboard/wallet/connect # Connect wallet
```

### Assignment Tracker
```
GET  /api/dashboard/assignments    # Get assignments
POST /api/dashboard/assignments    # Create assignment
PUT  /api/dashboard/assignments/:id # Update assignment
```

### Campus Map
```
GET  /api/dashboard/map/locations  # Get campus locations
POST /api/dashboard/map/navigate   # Get navigation route
```

### Academic Results
```
GET  /api/dashboard/results                    # Get academic results
POST /api/dashboard/results/calculate-gpa     # Calculate GPA
GET  /api/dashboard/results/transcript/:userId # Generate transcript
```

### Chatbot
```
POST /api/chatbot/chat              # Process chat message
POST /api/chatbot/sheets            # Send data to Google Sheets
GET  /api/chatbot/history/:sessionId # Get chat history
GET  /api/chatbot/analytics         # Get chatbot analytics
POST /api/chatbot/sheets/test       # Test Google Sheets connection
```

### Health Check
```
GET /api/health      # Server health status
GET /api/health/ping # Simple ping endpoint
```

## 🔐 Authentication

All API endpoints (except health checks) require authentication:

**Header Authentication:**
```
X-API-Key: blockitin-ai-2024
```

**Bearer Token:**
```
Authorization: Bearer blockitin-ai-2024
```

## 🛠️ Quick Start

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

## 📊 Google Sheets Integration

The backend automatically logs all dashboard activities to Google Sheets:

- **Webhook URL:** Configured in environment variables
- **Real-time Sync:** All user actions are logged
- **Analytics Data:** Usage patterns and insights
- **Error Handling:** Graceful fallbacks for connectivity issues

## 🏗️ Architecture

```
backend/
├── src/
│   ├── server.ts              # Main server configuration
│   ├── middleware/            # Express middleware
│   │   ├── auth.ts           # API key authentication
│   │   └── errorHandler.ts   # Error handling & logging
│   ├── routes/               # API route handlers
│   │   ├── dashboard.ts      # All dashboard endpoints
│   │   ├── chatbot.ts        # Chatbot endpoints
│   │   └── health.ts         # Health check endpoints
│   ├── services/             # Business logic services
│   │   ├── DashboardService.ts # Dashboard functionality
│   │   ├── ChatbotService.ts   # Chat processing
│   │   └── GoogleSheetsService.ts # Sheets integration
│   └── validators/           # Input validation
│       ├── dashboard.ts      # Dashboard request validation
│       └── chatbot.ts        # Chatbot request validation
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── .env                     # Environment variables
└── README.md               # This file
```

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request throttling (100 req/15min)
- **Input Validation** - Joi schema validation
- **API Key Authentication** - Secure endpoint access
- **Error Sanitization** - Safe error responses

## 📈 Monitoring & Analytics

- **Health Endpoints** - Server status monitoring
- **Request Logging** - Morgan HTTP request logger
- **Memory Tracking** - Process memory usage
- **Google Sheets Logging** - User activity tracking
- **Error Reporting** - Comprehensive error handling

## 🚀 Production Deployment

1. **Build Application:**
   ```bash
   npm run build
   ```

2. **Set Production Environment:**
   ```bash
   export NODE_ENV=production
   export PORT=3001
   export API_KEY=your-secure-api-key
   ```

3. **Start Production Server:**
   ```bash
   npm start
   ```

4. **Process Management:**
   ```bash
   # Using PM2
   pm2 start dist/server.js --name "blockitin-backend"
   ```

## 📝 Environment Variables

```env
PORT=3001                                    # Server port
NODE_ENV=development                         # Environment
CORS_ORIGIN=http://localhost:5173           # Frontend URL
GOOGLE_APPS_SCRIPT_URL=your-webhook-url     # Google Sheets webhook
API_KEY=blockitin-ai-2024                   # API authentication key
RATE_LIMIT_WINDOW_MS=900000                 # Rate limit window (15 min)
RATE_LIMIT_MAX_REQUESTS=100                 # Max requests per window
```

## 🧪 Development

- **Hot Reload:** `npm run dev` - Development with auto-restart
- **Type Checking:** `npm run build` - TypeScript compilation
- **Linting:** `npm run lint` - ESLint code quality
- **Testing:** `npm test` - Jest test runner (when implemented)

## 📚 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

Error responses:
```json
{
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "path": "/api/dashboard/credentials",
    "method": "POST"
  }
}
```

## 🤝 Integration

The backend is designed to work seamlessly with the Blockitin AI frontend dashboard, providing:

- **Real-time Data** - Live updates via API calls
- **Comprehensive Coverage** - All dashboard functions supported
- **Google Sheets Sync** - Automatic data logging and backup
- **Scalable Architecture** - Ready for production deployment
- **Developer Friendly** - Clear documentation and error messages

Perfect for supporting your complete Web3 student identity dashboard! 🎓✨
