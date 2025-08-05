import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, RotateCcw } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface ChatbotProps {
  onNavigate: (section: string, itemId?: string) => void
}

const Chatbot: React.FC<ChatbotProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi Sarah! 👋 I'm your Blockitin AI assistant. I can help you navigate your academic identity, manage credentials, track wellness, and more. What would you like to do today?",
      timestamp: new Date(),
      suggestions: [
        "Show my NFT credentials",
        "Check my wellness score",
        "View recent assignments",
        "Find health records"
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

  const generateBotResponse = (userMessage: string): { content: string; suggestions?: string[]; action?: { type: string; section: string; itemId?: string } } => {
    const message = userMessage.toLowerCase()

    // Navigation commands
    if (message.includes('credential') || message.includes('nft') || message.includes('degree') || message.includes('certificate')) {
      return {
        content: "I'll take you to your NFT Credentials section where you can view all your verified academic achievements, including your Computer Science degree, AI certification, and blockchain developer certificate. You currently have 12 NFT credentials with over 3,200 total views! 🎓",
        action: { type: 'navigate', section: 'credentials' },
        suggestions: ["Mint new credential", "Share my degree", "View credential stats"]
      }
    }

    if (message.includes('health') || message.includes('medical') || message.includes('vaccine') || message.includes('wellness score')) {
      return {
        content: "Let me show you your Health Passport! You have 8 health records including your COVID-19 vaccination, annual checkup, and mental health assessment. Your current wellness score is 85% - great job maintaining your health! 🏥",
        action: { type: 'navigate', section: 'health' },
        suggestions: ["Add new health record", "Share vaccination status", "Schedule checkup"]
      }
    }

    if (message.includes('assignment') || message.includes('homework') || message.includes('project') || message.includes('due')) {
      return {
        content: "Here are your current assignments! You have 4 active assignments including your Machine Learning Final Project (due in 3 days), Blockchain Smart Contract Development, and AI Ethics Research Paper. I can help you prioritize based on due dates. 📚",
        action: { type: 'navigate', section: 'assignments' },
        suggestions: ["Show overdue assignments", "Set assignment reminder", "View completed work"]
      }
    }

    if (message.includes('resume') || message.includes('cv') || message.includes('job') || message.includes('career')) {
      return {
        content: "I'll open your AI Resume Builder! Your resume has been viewed 234 times this month. The AI has suggestions to improve your skills section and add your recent blockchain certification. Would you like me to help optimize it? 💼",
        action: { type: 'navigate', section: 'resume' },
        suggestions: ["Update skills section", "Add new experience", "Download resume"]
      }
    }

    if (message.includes('wellness') || message.includes('mood') || message.includes('mental health') || message.includes('fitness')) {
      return {
        content: "Your wellness dashboard shows you're doing great! Your current wellness score is 85%, mood tracking shows mostly positive days this week, and you're 80% towards your fitness goals. Keep up the excellent work! 😊",
        action: { type: 'navigate', section: 'wellness' },
        suggestions: ["Log today's mood", "Update fitness goals", "View wellness trends"]
      }
    }

    if (message.includes('attendance') || message.includes('class') || message.includes('lecture') || message.includes('present')) {
      return {
        content: "Your attendance record looks excellent! You've attended 47 out of 50 classes this semester (94% attendance rate). Your recent attendance includes Advanced AI Lecture, Blockchain Fundamentals, and Quantum Computing Seminar. 📅",
        action: { type: 'navigate', section: 'attendance' },
        suggestions: ["View attendance by course", "Check upcoming classes", "Export attendance report"]
      }
    }

    if (message.includes('publish') || message.includes('research') || message.includes('paper') || message.includes('journal')) {
      return {
        content: "Your academic publishing profile is impressive! You have 3 published papers, 2 under review, and 1 in draft. Your latest publication on quantum computing applications has 127 citations. Ready to submit your next paper? 📖",
        action: { type: 'navigate', section: 'publishing' },
        suggestions: ["Submit new paper", "Check citation metrics", "Find collaboration opportunities"]
      }
    }

    if (message.includes('campus') || message.includes('map') || message.includes('building') || message.includes('location')) {
      return {
        content: "I'll show you the interactive campus map! You can find locations like the Health Center, Engineering Building, Student Wellness Center, and Library. I can also provide directions and show current occupancy levels. 🗺️",
        action: { type: 'navigate', section: 'campus-map' },
        suggestions: ["Find nearest study space", "Check building hours", "Get directions"]
      }
    }

    if (message.includes('dashboard') || message.includes('overview') || message.includes('summary') || message.includes('home')) {
      return {
        content: "Welcome back to your dashboard! Here's your quick overview: 12 NFT credentials, 234 resume views, 8 health records, and 85% wellness score. You have 2 assignments due this week and 1 new research collaboration opportunity. 📊",
        action: { type: 'navigate', section: 'dashboard' },
        suggestions: ["View recent activity", "Check notifications", "Update profile"]
      }
    }

    // Stats and information queries
    if (message.includes('stats') || message.includes('statistics') || message.includes('numbers') || message.includes('overview')) {
      return {
        content: "Here are your key stats: 📈\n• 12 NFT Credentials (3,218 total views)\n• 85% Wellness Score\n• 94% Class Attendance\n• 3 Published Research Papers\n• 4 Active Assignments\n• 8 Health Records\n\nYou're performing excellently across all areas!",
        suggestions: ["View detailed analytics", "Compare with peers", "Set new goals"]
      }
    }

    // Help and guidance
    if (message.includes('help') || message.includes('how') || message.includes('guide') || message.includes('tutorial')) {
      return {
        content: "I'm here to help! I can assist you with:\n\n🎓 Managing NFT credentials and academic achievements\n🏥 Tracking health records and wellness\n📚 Organizing assignments and deadlines\n💼 Building and optimizing your resume\n🗺️ Navigating campus resources\n📊 Understanding your academic analytics\n\nWhat specific area would you like help with?",
        suggestions: ["Credential management", "Health tracking", "Assignment planning", "Resume optimization"]
      }
    }

    // Blockchain and Web3 queries
    if (message.includes('blockchain') || message.includes('web3') || message.includes('nft') || message.includes('mint') || message.includes('wallet')) {
      return {
        content: "Your Web3 academic identity is secured on the blockchain! 🔗 Your wallet (0x1234...5678) holds 12 verified NFT credentials. Minting a new credential costs ~0.05 ETH plus gas fees. All your achievements are permanently verified and tamper-proof.",
        suggestions: ["Connect different wallet", "Mint new NFT", "View blockchain transactions", "Learn about Web3 identity"]
      }
    }

    // Greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good morning') || message.includes('good afternoon')) {
      return {
        content: "Hello Sarah! 👋 Great to see you again. I'm here to help you manage your academic identity and navigate Blockitin AI. Your wellness score is looking good at 85% and you have some assignments coming up. What can I help you with today?",
        suggestions: ["Check my credentials", "View assignments", "Update wellness", "Show dashboard"]
      }
    }

    // Default response with smart suggestions
    return {
      content: "I'd be happy to help you with that! I can assist you with managing your academic credentials, tracking wellness, organizing assignments, building your resume, and navigating campus resources. Could you be more specific about what you're looking for?",
      suggestions: ["Show my credentials", "Check wellness score", "View assignments", "Help with resume"]
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

    // Simulate typing delay
    setTimeout(() => {
      const response = generateBotResponse(text)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)

      // Handle navigation action
      if (response.action) {
        setTimeout(() => {
          onNavigate(response.action!.section, response.action!.itemId)
        }, 1000)
      }
    }, 1000 + Math.random() * 1000)
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
        content: "Hi Sarah! 👋 I'm your Blockitin AI assistant. I can help you navigate your academic identity, manage credentials, track wellness, and more. What would you like to do today?",
        timestamp: new Date(),
        suggestions: [
          "Show my NFT credentials",
          "Check my wellness score", 
          "View recent assignments",
          "Find health records"
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
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Blockitin AI Assistant</h3>
                <p className="text-xs opacity-90">Always here to help</p>
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
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`rounded-2xl px-4 py-2 ${
                          message.type === 'user'
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
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
                    placeholder="Ask me anything about your academic identity..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
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
