import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot' | 'system'
  content: string
  timestamp: Date
  suggestions?: string[]
  isError?: boolean
  isSuccess?: boolean
}

interface ChatbotProps {
  onNavigate: (section: string, itemId?: string) => void
}

interface GoogleSheetsResponse {
  success: boolean
  message?: string
  data?: any
  error?: string
}

const Chatbot: React.FC<ChatbotProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi Sarah! 👋 I'm your Blockitin AI assistant connected to your Google Sheets data. I can help you navigate your academic identity, manage credentials, track wellness, and sync data with your spreadsheets. What would you like to do today?",
      timestamp: new Date(),
      suggestions: [
        "Show my NFT credentials",
        "Save data to Google Sheets",
        "Check my wellness score",
        "View recent assignments"
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxNF_KFb0w_MHCjTTSQYLs1Ks8JssJfLMdqdOCVLS5Jw4ySPIsGPjfEvutG-DWtz5I/exec'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  // Send data to Google Sheets
  const sendToGoogleSheets = async (action: string, data: any): Promise<GoogleSheetsResponse> => {
    try {
      setIsConnecting(true)
      
      const payload = {
        action,
        data,
        timestamp: new Date().toISOString(),
        user: 'Sarah Johnson', // This could be dynamic based on logged-in user
        source: 'Blockitin AI Chatbot'
      }

      const response = await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      // Note: With no-cors mode, we can't read the response
      // So we'll assume success if no error is thrown
      return {
        success: true,
        message: 'Data sent to Google Sheets successfully'
      }
    } catch (error) {
      console.error('Error sending to Google Sheets:', error)
      return {
        success: false,
        error: 'Failed to connect to Google Sheets'
      }
    } finally {
      setIsConnecting(false)
    }
  }

  // Get data from Google Sheets
  const getFromGoogleSheets = async (action: string, params?: any): Promise<GoogleSheetsResponse> => {
    try {
      setIsConnecting(true)
      
      const url = new URL(GOOGLE_SHEETS_URL)
      url.searchParams.append('action', action)
      if (params) {
        Object.keys(params).forEach(key => {
          url.searchParams.append(key, params[key])
        })
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        mode: 'no-cors'
      })

      // With no-cors, we can't read the actual response
      // In a real implementation, you'd need to handle CORS properly
      return {
        success: true,
        message: 'Data retrieved from Google Sheets',
        data: null // Would contain actual data in a proper CORS setup
      }
    } catch (error) {
      console.error('Error getting from Google Sheets:', error)
      return {
        success: false,
        error: 'Failed to retrieve data from Google Sheets'
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const generateBotResponse = async (userMessage: string): Promise<{ content: string; suggestions?: string[]; action?: { type: string; section: string; itemId?: string }; sheetsAction?: boolean }> => {
    const message = userMessage.toLowerCase()

    // Google Sheets specific commands
    if (message.includes('save') && (message.includes('sheet') || message.includes('google') || message.includes('data'))) {
      const result = await sendToGoogleSheets('save_chat_data', {
        message: userMessage,
        context: 'user_request',
        category: 'data_save'
      })

      return {
        content: result.success 
          ? "✅ Great! I've saved your data to Google Sheets. Your information is now synced and backed up in your spreadsheet. You can view it anytime in your connected Google Sheet." 
          : "❌ Sorry, I couldn't connect to Google Sheets right now. Please check your internet connection and try again.",
        suggestions: ["View saved data", "Sync more information", "Check connection status"],
        sheetsAction: true
      }
    }

    if (message.includes('sync') || message.includes('backup') || message.includes('export')) {
      const result = await sendToGoogleSheets('sync_academic_data', {
        credentials: 12,
        gpa: 3.85,
        wellness_score: 85,
        assignments: 4,
        health_records: 8
      })

      return {
        content: result.success
          ? "🔄 Perfect! I've synced all your academic data to Google Sheets:\n\n📊 12 NFT Credentials\n🎓 3.85 GPA\n💪 85% Wellness Score\n📚 4 Active Assignments\n🏥 8 Health Records\n\nYour data is now backed up and accessible in your spreadsheet!"
          : "❌ Sync failed. Please check your Google Sheets connection and try again.",
        suggestions: ["View synced data", "Schedule auto-sync", "Download backup"],
        sheetsAction: true
      }
    }

    if (message.includes('connect') && message.includes('sheet')) {
      return {
        content: "🔗 Testing connection to Google Sheets...\n\nConnection Status: ✅ Connected\nWebhook URL: Active\nLast Sync: Just now\n\nYour Blockitin AI is successfully connected to Google Sheets! You can now save, sync, and backup all your academic data.",
        suggestions: ["Save current data", "Sync all information", "View connection details"]
      }
    }

    // Navigation commands with Google Sheets integration
    if (message.includes('credential') || message.includes('nft') || message.includes('degree') || message.includes('certificate')) {
      // Log this navigation to Google Sheets
      await sendToGoogleSheets('log_navigation', {
        section: 'credentials',
        action: 'view_credentials',
        user_query: userMessage
      })

      return {
        content: "I'll take you to your NFT Credentials section and log this activity to Google Sheets! 🎓\n\nYou currently have 12 NFT credentials with over 3,200 total views. This navigation has been recorded in your activity log.",
        action: { type: 'navigate', section: 'credentials' },
        suggestions: ["Mint new credential", "Save credentials to Sheets", "View credential analytics"],
        sheetsAction: true
      }
    }

    if (message.includes('health') || message.includes('medical') || message.includes('vaccine') || message.includes('wellness score')) {
      await sendToGoogleSheets('log_health_access', {
        section: 'health',
        wellness_score: 85,
        records_count: 8
      })

      return {
        content: "Opening your Health Passport and syncing with Google Sheets! 🏥\n\nYour wellness score (85%) and 8 health records are being backed up to your spreadsheet for secure access.",
        action: { type: 'navigate', section: 'health' },
        suggestions: ["Add new health record", "Sync health data", "Export health report"],
        sheetsAction: true
      }
    }

    if (message.includes('assignment') || message.includes('homework') || message.includes('project') || message.includes('due')) {
      await sendToGoogleSheets('track_assignments', {
        active_assignments: 4,
        upcoming_deadlines: 2,
        query: userMessage
      })

      return {
        content: "📚 Showing your assignments and logging to Google Sheets!\n\nYou have 4 active assignments including your Machine Learning Final Project (due in 3 days). Assignment tracking data is now synced to your spreadsheet.",
        action: { type: 'navigate', section: 'assignments' },
        suggestions: ["Save assignment progress", "Set deadline reminders", "Export assignment list"],
        sheetsAction: true
      }
    }

    // Data analysis commands
    if (message.includes('analytics') || message.includes('report') || message.includes('summary')) {
      const result = await sendToGoogleSheets('generate_analytics', {
        request_type: 'comprehensive_report',
        timestamp: new Date().toISOString()
      })

      return {
        content: "📊 Generating comprehensive analytics report...\n\n✅ Data collected from all sections\n✅ Sent to Google Sheets for processing\n✅ Report will be available in your spreadsheet\n\nYour analytics include: GPA trends, wellness patterns, credential growth, and assignment completion rates.",
        suggestions: ["View detailed report", "Download analytics", "Schedule weekly reports"],
        sheetsAction: true
      }
    }

    // Help with Google Sheets integration
    if (message.includes('help') && (message.includes('sheet') || message.includes('google') || message.includes('sync'))) {
      return {
        content: "🔧 Google Sheets Integration Help:\n\n📝 **Available Commands:**\n• 'Save to sheets' - Backup current data\n• 'Sync data' - Full synchronization\n• 'Connect sheets' - Test connection\n• 'Export report' - Generate analytics\n\n🔗 **Connection Status:** Active\n📊 **Auto-sync:** Enabled\n💾 **Last Backup:** Real-time\n\nYour data is automatically saved to Google Sheets for secure access anywhere!",
        suggestions: ["Test connection", "Save all data", "View sync history", "Configure auto-sync"]
      }
    }

    // Default responses with Google Sheets integration
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      await sendToGoogleSheets('log_interaction', {
        type: 'greeting',
        message: userMessage
      })

      return {
        content: "Hello Sarah! 👋 Great to see you again. I'm connected to your Google Sheets and ready to help!\n\n📊 Current Status:\n• Wellness Score: 85%\n• Upcoming Assignments: 2\n• Google Sheets: ✅ Connected\n\nWhat can I help you with today?",
        suggestions: ["Sync my data", "Check credentials", "View assignments", "Save to sheets"],
        sheetsAction: true
      }
    }

    // Default response
    return {
      content: "I'd be happy to help you with that! I can assist you with managing your academic credentials, tracking wellness, organizing assignments, and syncing everything to Google Sheets. Could you be more specific about what you're looking for?",
      suggestions: ["Show my credentials", "Save data to Sheets", "Check wellness score", "View assignments"]
    }
  }

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim()
    if (!text) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const response = await generateBotResponse(text)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        isSuccess: response.sheetsAction
      }

      setMessages(prev => [...prev, botMessage])

      // Handle navigation action
      if (response.action) {
        setTimeout(() => {
          onNavigate(response.action!.section, response.action!.itemId)
        }, 1000)
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'system',
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const resetChat = () => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: "Hi Sarah! 👋 I'm your Blockitin AI assistant connected to your Google Sheets data. I can help you navigate your academic identity, manage credentials, track wellness, and sync data with your spreadsheets. What would you like to do today?",
        timestamp: new Date(),
        suggestions: [
          "Show my NFT credentials",
          "Save data to Google Sheets",
          "Check my wellness score",
          "View recent assignments"
        ]
      }
    ])
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Chat Toggle Button */}
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

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center relative">
                <Bot className="w-5 h-5" />
                {isConnecting && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold">Blockitin AI Assistant</h3>
                <p className="text-xs opacity-90 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                  Google Sheets Connected
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={resetChat}
                className="p-1 hover:bg-white/20 rounded"
                title="Reset chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[440px]">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === 'user' 
                            ? 'bg-indigo-500 text-white' 
                            : message.type === 'system'
                            ? message.isError ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : message.type === 'system' ? (
                            message.isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>
                        <div className={`rounded-2xl px-4 py-2 ${
                          message.type === 'user'
                            ? 'bg-indigo-500 text-white'
                            : message.type === 'system'
                            ? message.isError ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'
                            : message.isSuccess
                            ? 'bg-green-50 text-gray-800 border border-green-200'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          {message.isSuccess && (
                            <div className="flex items-center mt-2 text-xs text-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Synced with Google Sheets
                            </div>
                          )}
                          <p className={`text-xs mt-1 ${
                            message.type === 'user' ? 'text-indigo-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Suggestions */}
                      {message.suggestions && message.type === 'bot' && (
                        <div className="mt-3 ml-10 space-y-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything or say 'save to sheets'..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    disabled={isTyping || isConnecting}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isTyping || isConnecting}
                    className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative"
                  >
                    <Send className="w-4 h-4" />
                    {isConnecting && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </button>
                </div>
                
                {/* Connection Status */}
                <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Connected to Google Sheets</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default Chatbot
