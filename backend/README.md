# Blockitin Chatbot Backend

A comprehensive backend API for the Blockitin AI Chatbot with Google Sheets integration, real-time messaging, and intelligent response generation.

## 🌟 Features

- 🤖 **AI-Powered Chatbot** - OpenAI GPT integration for intelligent responses
- 📊 **Google Sheets Integration** - Seamless data sync and analytics
- 🔐 **Authentication** - JWT-based user authentication
- 💬 **Real-time Chat** - WebSocket support for instant messaging
- 📱 **RESTful API** - Clean, documented REST endpoints
- 🛡️ **Security** - Rate limiting, CORS, input validation
- 📈 **Analytics** - Conversation tracking and user insights
- 🗄️ **Database** - MongoDB with Mongoose ODM

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB
- Google Sheets API credentials
- OpenAI API key

### Installation

1. **Clone and setup**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables** (`.env`):
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/blockitin-chatbot
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   
   # Google Sheets API
   GOOGLE_CLIENT_EMAIL=your-service-account-email@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEET_ID=your-google-sheet-id-here
   
   # OpenAI
   OPENAI_API_KEY=sk-your-openai-api-key-here
   
   # CORS
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📊 Google Sheets Setup

### 1. Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create credentials → Service Account
5. Download the JSON key file

### 2. Setup Spreadsheet

1. Create a new Google Sheet
2. Share it with your service account email
3. Copy the sheet ID from the URL
4. The backend will automatically create required worksheets:
   - `ChatLogs` - Chat interactions
   - `NavigationLogs` - User navigation tracking
   - `AcademicData` - Academic information sync
   - `UserAnalytics` - User behavior analytics

## 🔧 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Chat Endpoints

#### Send Message
```http
POST /api/chat/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Hello, I need help with my credentials",
  "sessionId": "optional-session-id",
  "academicData": {
    "credentials": 12,
    "gpa": 3.85,
    "wellness_score": 85,
    "assignments": 4,
    "health_records": 8
  }
}
```

#### Get Chat History
```http
GET /api/chat/sessions/{sessionId}/history?limit=50
Authorization: Bearer <token>
```

#### Get User Sessions
```http
GET /api/chat/sessions
Authorization: Bearer <token>
```

#### System Health Check
```http
GET /api/chat/health
Authorization: Bearer <token>
```

## 🔌 WebSocket Events

### Client → Server

```javascript
// Join user room
socket.emit('join-user-room', userId);

// Send chat message
socket.emit('chat-message', {
  userId: 'user-id',
  message: 'Hello chatbot',
  sessionId: 'session-id'
});

// Typing indicators
socket.emit('typing-start', { userId: 'user-id' });
socket.emit('typing-stop', { userId: 'user-id' });
```

### Server → Client

```javascript
// Bot response
socket.on('bot-response', (data) => {
  console.log(data.response);
});

// Bot typing indicator
socket.on('bot-typing', (isTyping) => {
  console.log('Bot is typing:', isTyping);
});

// Error handling
socket.on('error', (error) => {
  console.error('Socket error:', error);
});
```

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── authController.ts
│   │   └── chatController.ts
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts
│   │   └── security.ts
│   ├── models/              # Database models
│   │   ├── User.ts
│   │   ├── Message.ts
│   │   ├── ChatSession.ts
│   │   └── index.ts
│   ├── routes/              # API routes
│   │   ├── auth.ts
│   │   └── chat.ts
│   ├── services/            # Business logic
│   │   ├── AIService.ts
│   │   ├── ChatbotService.ts
│   │   └── GoogleSheetsService.ts
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   ├── utils/               # Utilities
│   │   └── database.ts
│   └── server.ts            # Main application
├── .env.example             # Environment template
├── package.json             # Dependencies
├── tsconfig.json           # TypeScript config
├── nodemon.json            # Development config
└── README.md               # This file
```

## 🧠 AI Service Integration

The chatbot uses OpenAI's GPT-3.5-turbo for intelligent responses with:

- **Context Awareness** - Remembers conversation history
- **Intent Recognition** - Understands user intentions
- **Academic Focus** - Specialized for educational use cases
- **Google Sheets Integration** - Automatic data logging
- **Fallback Responses** - Works without AI when needed

### Customizing AI Responses

Edit `src/services/AIService.ts` to modify:
- System prompts
- Response formatting
- Intent analysis
- Contextual suggestions

## 📊 Google Sheets Integration Features

### Automatic Data Logging
- Chat interactions
- User navigation patterns
- Academic data synchronization
- System analytics

### Manual Operations
```javascript
// Initialize sheet structure
POST /api/chat/initialize-sheets

// Test connection
GET /api/chat/health
```

## 🛡️ Security Features

### Rate Limiting
- API endpoints: 100 requests/15 minutes
- Chat messages: 30 messages/minute
- Authentication: 5 attempts/15 minutes

### Input Validation
- Message length limits
- XSS protection
- SQL injection prevention
- Request sanitization

### Authentication
- JWT tokens with expiration
- Password hashing with bcrypt
- Protected routes

## 🚀 Deployment

### Environment Setup
```bash
# Production environment
NODE_ENV=production
PORT=5000

# Use production MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/production

# Secure JWT secret
JWT_SECRET=your-production-secret-key
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Cloud Deployment
- **Heroku**: Use provided Procfile
- **AWS**: Deploy with Elastic Beanstalk
- **Google Cloud**: Use App Engine
- **Digital Ocean**: App Platform ready

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run test        # Run tests (when added)
```

### Adding New Features

1. **New API Endpoint**:
   - Add controller in `src/controllers/`
   - Create route in `src/routes/`
   - Add middleware if needed

2. **Database Model**:
   - Create model in `src/models/`
   - Export from `src/models/index.ts`

3. **AI Functionality**:
   - Extend `src/services/AIService.ts`
   - Update prompts and response parsing

## 🤝 Integration with Frontend

### Frontend Configuration
Update your frontend to connect to the backend:

```javascript
// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// WebSocket connection
const socket = io('http://localhost:5000');

// Update Chatbot.tsx
const handleSendMessage = async (message) => {
  const response = await fetch(`${API_BASE_URL}/chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  });
  
  const data = await response.json();
  return data;
};
```

## 📈 Monitoring and Analytics

### Health Monitoring
```http
GET /health
GET /api/chat/health
```

### Google Sheets Analytics
- Real-time data synchronization
- User behavior tracking
- Conversation analytics
- Performance metrics

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check if MongoDB is running
   - Verify connection string
   - Check network connectivity

2. **Google Sheets API Errors**
   - Verify service account credentials
   - Check sheet permissions
   - Ensure API is enabled

3. **OpenAI API Issues**
   - Validate API key
   - Check rate limits
   - Verify account credits

4. **CORS Errors**
   - Update `ALLOWED_ORIGINS` in `.env`
   - Check frontend URL configuration

### Debug Mode
```bash
NODE_ENV=development npm run dev
```

## 📝 License

MIT License - feel free to use this project for learning and development.

---

🤖 **Ready to power your chatbot with AI and Google Sheets integration!**

For questions or support, check the source code comments or create an issue.