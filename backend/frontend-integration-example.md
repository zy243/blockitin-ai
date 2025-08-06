# Frontend Integration Example

This guide shows how to update your existing Chatbot.tsx to work with the new backend API.

## 1. Install Dependencies

First, add these dependencies to your frontend project:

```bash
npm install socket.io-client
```

## 2. Create API Service

Create a new file `src/services/api.ts`:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  private async request<T = any>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Network error'
      };
    }
  }

  async login(email: string, password: string): Promise<ApiResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(email: string, name: string, password: string): Promise<ApiResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, name, password })
    });
  }

  async sendMessage(message: string, sessionId?: string, academicData?: any): Promise<ApiResponse> {
    return this.request('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId, academicData })
    });
  }

  async getChatHistory(sessionId: string): Promise<ApiResponse> {
    return this.request(`/chat/sessions/${sessionId}/history`);
  }

  async createSession(): Promise<ApiResponse> {
    return this.request('/chat/sessions', { method: 'POST' });
  }
}

export const apiService = new ApiService();
```

## 3. Update Chatbot Component

Update your `Chatbot.tsx` to use the backend API:

```typescript
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { apiService } from '../services/api';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  isError?: boolean;
  isSuccess?: boolean;
}

interface ChatbotProps {
  onNavigate: (section: string, itemId?: string) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const socketConnection = io('http://localhost:5000');
    setSocket(socketConnection);

    socketConnection.on('connect', () => {
      console.log('Connected to WebSocket');
      // Join user room if authenticated
      const token = apiService.getToken();
      if (token) {
        // You would parse the user ID from the token
        socketConnection.emit('join-user-room', 'user-id');
      }
    });

    socketConnection.on('bot-response', (data) => {
      // Handle real-time bot responses
      console.log('Real-time response:', data);
    });

    socketConnection.on('bot-typing', (isTyping) => {
      setIsTyping(isTyping);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Create chat session when component mounts
  useEffect(() => {
    const initializeChat = async () => {
      if (!sessionId) {
        const response = await apiService.createSession();
        if (response.success) {
          setSessionId(response.data.sessionId);
          // Add welcome message
          setMessages([{
            id: '1',
            type: 'bot',
            content: "Hi! 👋 I'm your Blockitin AI assistant. I can help you navigate your academic identity, manage credentials, track wellness, and sync data with Google Sheets. What would you like to do today?",
            timestamp: new Date(),
            suggestions: [
              "Show my NFT credentials",
              "Save data to Google Sheets",
              "Check my wellness score",
              "View recent assignments"
            ]
          }]);
        }
      }
    };

    initializeChat();
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isConnecting) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsConnecting(true);

    try {
      // Get academic data from your app state
      const academicData = {
        credentials: 12,
        gpa: 3.85,
        wellness_score: 85,
        assignments: 4,
        health_records: 8
      };

      const response = await apiService.sendMessage(text, sessionId || undefined, academicData);
      
      if (response.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response.data.response.content,
          timestamp: new Date(),
          suggestions: response.data.response.suggestions,
          isSuccess: response.data.response.sheetsSync
        };

        setMessages(prev => [...prev, botMessage]);

        // Handle navigation action
        if (response.data.response.action) {
          setTimeout(() => {
            onNavigate(response.data.response.action.section, response.data.response.action.itemId);
          }, 1000);
        }

        // Update session ID if it was created
        if (response.data.sessionId && !sessionId) {
          setSessionId(response.data.sessionId);
        }
      } else {
        throw new Error(response.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'system',
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = async () => {
    // Create new session
    const response = await apiService.createSession();
    if (response.success) {
      setSessionId(response.data.sessionId);
      setMessages([{
        id: '1',
        type: 'bot',
        content: "Hi! 👋 I'm your Blockitin AI assistant. How can I help you today?",
        timestamp: new Date(),
        suggestions: [
          "Show my NFT credentials",
          "Save data to Google Sheets",
          "Check my wellness score",
          "View recent assignments"
        ]
      }]);
    }
  };

  // Rest of your existing JSX remains the same...
  
  return (
    <>
      {/* Your existing JSX structure */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 z-50"
        >
          <MessageCircle className="w-6 h-6" />
          {isConnecting && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          )}
        </button>
      )}

      {/* Rest of your chat UI... */}
    </>
  );
};

export default Chatbot;
```

## 4. Authentication Integration

If you want to add user authentication, create a login component:

```typescript
// src/components/Login.tsx
import React, { useState } from 'react';
import { apiService } from '../services/api';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = isLogin 
      ? await apiService.login(email, password)
      : await apiService.register(email, name, password);
    
    if (response.success) {
      apiService.setToken(response.data.token);
      onLogin();
    } else {
      alert(response.error || 'Authentication failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {isLogin ? 'Login' : 'Register'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
        )}
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="w-full mt-2 text-blue-500 underline"
      >
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </div>
  );
};

export default Login;
```

## 5. Environment Variables

Add to your frontend `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 6. Testing the Integration

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start your frontend:
   ```bash
   npm start
   ```

3. Test the chatbot functionality with the new backend integration.

## Key Benefits of Backend Integration

✅ **Persistent Chat History** - Messages saved to database  
✅ **User Authentication** - Secure user sessions  
✅ **AI-Powered Responses** - OpenAI integration for smart replies  
✅ **Google Sheets Sync** - Automatic data backup and analytics  
✅ **Real-time Updates** - WebSocket support for instant messaging  
✅ **Session Management** - Multiple chat sessions per user  
✅ **Analytics & Insights** - Track user behavior and preferences  

Your chatbot is now powered by a full-featured backend with AI and Google Sheets integration!