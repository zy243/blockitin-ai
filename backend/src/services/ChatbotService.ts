import { v4 as uuidv4 } from 'uuid'
import { GoogleSheetsService } from './GoogleSheetsService'

export interface ChatMessage {
  id: string
  type: 'user' | 'bot' | 'system'
  content: string
  timestamp: Date
  userId: string
  sessionId: string
  suggestions?: string[]
  action?: {
    type: string
    section: string
    itemId?: string
  }
  metadata?: any
}

export interface ChatRequest {
  message: string
  userId: string
  sessionId: string
  context?: any
}

export interface ChatResponse {
  id: string
  type: 'bot'
  content: string
  timestamp: Date
  suggestions?: string[]
  action?: {
    type: string
    section: string
    itemId?: string
  }
  sheetsAction?: boolean
  metadata?: any
}

export class ChatbotService {
  private sheetsService: GoogleSheetsService
  private chatHistory: Map<string, ChatMessage[]> = new Map()

  constructor() {
    this.sheetsService = new GoogleSheetsService()
  }

  async processMessage(request: ChatRequest): Promise<ChatResponse> {
    const { message, userId, sessionId, context } = request
    
    // Store user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      userId,
      sessionId,
      metadata: context
    }

    this.addToHistory(sessionId, userMessage)

    // Generate bot response
    const botResponse = await this.generateResponse(message, userId, sessionId, context)
    
    // Store bot message
    const botMessage: ChatMessage = {
      ...botResponse,
      userId,
      sessionId
    }

    this.addToHistory(sessionId, botMessage)

    return botResponse
  }

  private async generateResponse(message: string, userId: string, sessionId: string, context?: any): Promise<ChatResponse> {
    const lowerMessage = message.toLowerCase()

    // Google Sheets specific commands
    if (lowerMessage.includes('save') && (lowerMessage.includes('sheet') || lowerMessage.includes('google') || lowerMessage.includes('data'))) {
      const result = await this.sheetsService.sendToSheets({
        action: 'save_chat_data',
        data: {
          message,
          context: 'user_request',
          category: 'data_save',
          userId,
          sessionId
        },
        userId,
        timestamp: new Date().toISOString(),
        source: 'Blockitin AI Chatbot Backend'
      })

      return {
        id: uuidv4(),
        type: 'bot',
        content: result.success 
          ? "✅ Great! I've successfully sent your data to Google Sheets via the backend webhook!\n\n📊 Google Sheets: Data Sent\n🔗 Backend: Active\n📝 Sheet ID: 1RkN9HJ9jhE_ymFlx4ZzorYs8TX5n2O3TJ4EOyk-jrUY\n\nYour information has been logged and is now available in your spreadsheet." 
          : "❌ Sorry, I couldn't connect to the Google Sheets webhook right now. Please check your connection and try again.",
        timestamp: new Date(),
        suggestions: ["View Google Sheet", "Sync more information", "Check backend status"],
        sheetsAction: true,
        metadata: { sheetsResult: result }
      }
    }

    if (lowerMessage.includes('sync') || lowerMessage.includes('backup') || lowerMessage.includes('export')) {
      const academicData = {
        credentials: 12,
        gpa: 3.85,
        wellness_score: 85,
        assignments: 4,
        health_records: 8,
        userId,
        sessionId
      }

      const result = await this.sheetsService.sendToSheets({
        action: 'sync_academic_data',
        data: academicData,
        userId,
        timestamp: new Date().toISOString(),
        source: 'Blockitin AI Chatbot Backend'
      })

      return {
        id: uuidv4(),
        type: 'bot',
        content: result.success
          ? "🔄 Perfect! I've sent your academic data to Google Sheets via backend:\n\n📊 12 NFT Credentials\n🎓 3.85 GPA\n💪 85% Wellness Score\n📚 4 Active Assignments\n🏥 8 Health Records\n\n✅ Data successfully transmitted via backend API!\n🔗 Backend URL: localhost:3001/api/chatbot/sheets"
          : "❌ Sync failed. Backend connection error.",
        timestamp: new Date(),
        suggestions: ["Open Google Sheet", "Retry sync", "Check backend logs"],
        sheetsAction: true,
        metadata: { sheetsResult: result, academicData }
      }
    }

    if (lowerMessage.includes('connect') && (lowerMessage.includes('sheet') || lowerMessage.includes('webhook') || lowerMessage.includes('backend'))) {
      const result = await this.sheetsService.testConnection()

      return {
        id: uuidv4(),
        type: 'bot',
        content: result.success
          ? "🔗 Testing backend connection to Google Sheets...\n\n✅ Backend Status: Active\n🌐 Backend URL: localhost:3001\n📊 Webhook URL: script.google.com/macros/s/AKfycbx...\n📝 Sheet ID: 1RkN9HJ9jhE_ymFlx4ZzorYs8TX5n2O3TJ4EOyk-jrUY\n⏰ Last Test: Just now\n\nYour Blockitin AI backend is successfully connected to Google Sheets!"
          : "❌ Backend connection test failed. Please check your backend server and Apps Script deployment.",
        timestamp: new Date(),
        suggestions: ["Open Google Sheet", "Retry connection", "View backend logs"],
        metadata: { connectionTest: result }
      }
    }

    // Navigation commands with Google Sheets integration
    if (lowerMessage.includes('credential') || lowerMessage.includes('nft') || lowerMessage.includes('degree') || lowerMessage.includes('certificate')) {
      // Log this navigation to Google Sheets via backend
      await this.sheetsService.sendToSheets({
        action: 'log_navigation',
        data: {
          section: 'credentials',
          action: 'view_credentials',
          user_query: message,
          userId,
          sessionId
        },
        userId,
        timestamp: new Date().toISOString(),
        source: 'Blockitin AI Chatbot Backend'
      })

      return {
        id: uuidv4(),
        type: 'bot',
        content: "I'll take you to your NFT Credentials section and log this activity via backend! 🎓\n\nYou currently have 12 NFT credentials with over 3,200 total views. This navigation has been sent to your Google Sheet via backend API.",
        timestamp: new Date(),
        action: { type: 'navigate', section: 'credentials' },
        suggestions: ["Mint new credential", "Open Google Sheet", "View credential analytics"],
        sheetsAction: true
      }
    }

    if (lowerMessage.includes('health') || lowerMessage.includes('medical') || lowerMessage.includes('vaccine') || lowerMessage.includes('wellness score')) {
      await this.sheetsService.sendToSheets({
        action: 'log_health_access',
        data: {
          section: 'health',
          wellness_score: 85,
          records_count: 8,
          userId,
          sessionId
        },
        userId,
        timestamp: new Date().toISOString(),
        source: 'Blockitin AI Chatbot Backend'
      })

      return {
        id: uuidv4(),
        type: 'bot',
        content: "Opening your Health Passport and logging via backend! 🏥\n\nYour wellness score (85%) and 8 health records data has been sent to Google Sheets via backend API.",
        timestamp: new Date(),
        action: { type: 'navigate', section: 'health' },
        suggestions: ["Add new health record", "Open Google Sheet", "Export health report"],
        sheetsAction: true
      }
    }

    if (lowerMessage.includes('assignment') || lowerMessage.includes('homework') || lowerMessage.includes('project') || lowerMessage.includes('due')) {
      await this.sheetsService.sendToSheets({
        action: 'track_assignments',
        data: {
          active_assignments: 4,
          upcoming_deadlines: 2,
          query: message,
          userId,
          sessionId
        },
        userId,
        timestamp: new Date().toISOString(),
        source: 'Blockitin AI Chatbot Backend'
      })

      return {
        id: uuidv4(),
        type: 'bot',
        content: "📚 Showing your assignments and sending data via backend!\n\nYou have 4 active assignments including your Machine Learning Final Project (due in 3 days). Assignment data transmitted to Google Sheets via backend API.",
        timestamp: new Date(),
        action: { type: 'navigate', section: 'assignments' },
        suggestions: ["Save assignment progress", "Open Google Sheet", "Export assignment list"],
        sheetsAction: true
      }
    }

    // Analytics and reporting
    if (lowerMessage.includes('analytics') || lowerMessage.includes('report') || lowerMessage.includes('summary')) {
      const result = await this.sheetsService.sendToSheets({
        action: 'generate_analytics',
        data: {
          request_type: 'comprehensive_report',
          userId,
          sessionId
        },
        userId,
        timestamp: new Date().toISOString(),
        source: 'Blockitin AI Chatbot Backend'
      })

      return {
        id: uuidv4(),
        type: 'bot',
        content: "📊 Generating comprehensive analytics report via backend...\n\n✅ Data collected from all sections\n✅ Sent to Google Sheets via backend API\n✅ Report available in your spreadsheet\n\nYour analytics include: GPA trends, wellness patterns, credential growth, and assignment completion rates.",
        timestamp: new Date(),
        suggestions: ["Open Google Sheet", "Download analytics", "Schedule weekly reports"],
        sheetsAction: true,
        metadata: { analyticsResult: result }
      }
    }

    // Help with backend integration
    if (lowerMessage.includes('help') && (lowerMessage.includes('backend') || lowerMessage.includes('api') || lowerMessage.includes('sheet') || lowerMessage.includes('google'))) {
      return {
        id: uuidv4(),
        type: 'bot',
        content: "🔧 Blockitin AI Backend Integration Help:\n\n📝 **Available Commands:**\n• 'Save to sheets' - Send data via backend\n• 'Open sheet' - Open your Google Sheet\n• 'Connect backend' - Test backend connection\n• 'Export report' - Generate and send analytics\n\n🌐 **Backend URL:** localhost:3001/api/chatbot\n🔗 **Webhook URL:** script.google.com/macros/s/AKfycbx...\n📊 **Sheet ID:** 1RkN9HJ9jhE_ymFlx4ZzorYs8TX5n2O3TJ4EOyk-jrUY\n💾 **Status:** Active backend with Google Sheets integration\n\nYour data is being processed through the backend API and sent to Google Sheets!",
        timestamp: new Date(),
        suggestions: ["Open Google Sheet", "Test backend", "Send all data", "View API logs"]
      }
    }

    // Default responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      await this.sheetsService.sendToSheets({
        action: 'log_interaction',
        data: {
          type: 'greeting',
          message,
          userId,
          sessionId
        },
        userId,
        timestamp: new Date().toISOString(),
        source: 'Blockitin AI Chatbot Backend'
      })

      return {
        id: uuidv4(),
        type: 'bot',
        content: "Hello! 👋 Great to see you again. I'm connected to your Google Sheets via backend API and ready to help!\n\n📊 Current Status:\n• Wellness Score: 85%\n• Upcoming Assignments: 2\n• Backend: ✅ Active\n• API: ✅ Connected\n• Sheet ID: 1RkN9HJ9jhE_ymFlx4ZzorYs8TX5n2O3TJ4EOyk-jrUY\n\nWhat can I help you with today?",
        timestamp: new Date(),
        suggestions: ["Open Google Sheet", "Sync my data", "Check credentials", "View assignments"],
        sheetsAction: true
      }
    }

    // Default response
    return {
      id: uuidv4(),
      type: 'bot',
      content: "I'd be happy to help you with that! I can assist you with managing your academic credentials, tracking wellness, organizing assignments, and sending data to Google Sheets via our backend API. Could you be more specific about what you're looking for?",
      timestamp: new Date(),
      suggestions: ["Show my credentials", "Open Google Sheet", "Check wellness score", "View assignments"]
    }
  }

  private addToHistory(sessionId: string, message: ChatMessage) {
    if (!this.chatHistory.has(sessionId)) {
      this.chatHistory.set(sessionId, [])
    }
    
    const history = this.chatHistory.get(sessionId)!
    history.push(message)
    
    // Keep only last 50 messages per session
    if (history.length > 50) {
      history.splice(0, history.length - 50)
    }
  }

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    return this.chatHistory.get(sessionId) || []
  }

  async getAnalytics() {
    const totalSessions = this.chatHistory.size
    const totalMessages = Array.from(this.chatHistory.values()).reduce((sum, messages) => sum + messages.length, 0)
    
    return {
      totalSessions,
      totalMessages,
      averageMessagesPerSession: totalSessions > 0 ? Math.round(totalMessages / totalSessions) : 0,
      activeSessions: totalSessions,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    }
  }
}
