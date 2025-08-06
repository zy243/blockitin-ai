import { AIService } from './AIService';
import { GoogleSheetsService } from './GoogleSheetsService';
import { Message, ChatSession, User, AcademicData } from '../models';
import { AIResponse, GoogleSheetsResponse } from '../types';

export class ChatbotService {
  private aiService: AIService;
  private sheetsService: GoogleSheetsService;

  constructor() {
    this.aiService = new AIService();
    this.sheetsService = new GoogleSheetsService();
  }

  async processMessage(
    userId: string,
    sessionId: string,
    messageContent: string,
    userContext?: any
  ): Promise<{
    botResponse: AIResponse;
    sheetsResponse?: GoogleSheetsResponse;
    messageId: string;
  }> {
    try {
      const startTime = Date.now();

      // Get user information
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get conversation history
      const recentMessages = await Message.find({
        userId,
        sessionId
      })
      .sort({ timestamp: -1 })
      .limit(5)
      .select('content type');

      const conversationHistory = recentMessages
        .reverse()
        .map(msg => `${msg.type}: ${msg.content}`);

      // Get academic data context (this would come from your app state)
      const academicData: AcademicData = userContext?.academicData || {
        credentials: 12,
        gpa: 3.85,
        wellness_score: 85,
        assignments: 4,
        health_records: 8
      };

      // Save user message
      const userMessage = new Message({
        userId,
        sessionId,
        type: 'user',
        content: messageContent,
        timestamp: new Date()
      });
      await userMessage.save();

      // Generate AI response
      const botResponse = await this.aiService.generateResponse(messageContent, {
        userId,
        userName: user.name,
        conversationHistory,
        academicData
      });

      // Handle Google Sheets integration
      let sheetsResponse: GoogleSheetsResponse | undefined;
      if (botResponse.sheetsAction) {
        sheetsResponse = await this.handleSheetsAction(messageContent, userId, user.name, botResponse);
      }

      // Save bot message
      const botMessage = new Message({
        userId,
        sessionId,
        type: 'bot',
        content: botResponse.content,
        timestamp: new Date(),
        suggestions: botResponse.suggestions,
        isSuccess: botResponse.sheetsAction,
        metadata: {
          action: botResponse.action?.type,
          section: botResponse.action?.section,
          itemId: botResponse.action?.itemId,
          sheetsSync: botResponse.sheetsAction,
          aiModel: 'gpt-3.5-turbo',
          processingTime: Date.now() - startTime
        }
      });
      await botMessage.save();

      // Update session
      await this.updateChatSession(sessionId, sheetsResponse ? 1 : 0);

      return {
        botResponse,
        sheetsResponse,
        messageId: (botMessage._id as any).toString()
      };

    } catch (error) {
      console.error('Error processing message:', error);
      
      // Save error message
      const errorMessage = new Message({
        userId,
        sessionId,
        type: 'system',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        isError: true
      });
      await errorMessage.save();

      throw error;
    }
  }

  private async handleSheetsAction(
    userMessage: string,
    userId: string,
    userName: string,
    botResponse: AIResponse
  ): Promise<GoogleSheetsResponse> {
    const message = userMessage.toLowerCase();

    // Save chat interaction to sheets
    if (message.includes('save') || message.includes('sheet') || message.includes('sync')) {
      return await this.sheetsService.logChatInteraction({
        action: 'chat_interaction',
        data: {
          message: userMessage,
          response: botResponse.content,
          action: botResponse.action
        },
        timestamp: new Date().toISOString(),
        user: userName,
        source: 'Blockitin AI Chatbot'
      });
    }

    // Handle navigation logging
    if (botResponse.action && botResponse.action.type === 'navigate') {
      return await this.sheetsService.logNavigation(
        userId,
        botResponse.action.section,
        'user_navigation',
        userMessage
      );
    }

    // Handle data sync
    if (message.includes('sync') || message.includes('backup')) {
      const academicData = {
        credentials: 12,
        gpa: 3.85,
        wellness_score: 85,
        assignments: 4,
        health_records: 8
      };
      return await this.sheetsService.syncAcademicData(userId, academicData);
    }

    // Handle analytics request
    if (message.includes('analytics') || message.includes('report')) {
      return await this.sheetsService.generateAnalyticsReport(userId);
    }

    // Default: log the interaction
    return await this.sheetsService.logChatInteraction({
      action: 'general_interaction',
      data: { message: userMessage },
      timestamp: new Date().toISOString(),
      user: userName,
      source: 'Blockitin AI Chatbot'
    });
  }

  private async updateChatSession(sessionId: string, sheetsInteractionIncrement: number = 0) {
    const session = await ChatSession.findById(sessionId);
    if (session) {
      session.messageCount += 1;
      session.lastActivity = new Date();
      if (session.metadata) {
        session.metadata.sheetsInteractions = 
          (session.metadata.sheetsInteractions || 0) + sheetsInteractionIncrement;
      }
      await session.save();
    }
  }

  async createChatSession(userId: string, userAgent?: string, ipAddress?: string): Promise<string> {
    const session = new ChatSession({
      userId,
      title: `Chat Session - ${new Date().toLocaleDateString()}`,
      isActive: true,
      messageCount: 0,
      metadata: {
        userAgent,
        ipAddress,
        sheetsInteractions: 0
      }
    });

    await session.save();
    return (session._id as any).toString();
  }

  async getChatHistory(userId: string, sessionId: string, limit: number = 50): Promise<any[]> {
    const messages = await Message.find({
      userId,
      sessionId
    })
    .sort({ timestamp: 1 })
    .limit(limit)
    .select('-__v');

    return messages.map(msg => ({
      id: msg._id,
      type: msg.type,
      content: msg.content,
      timestamp: msg.timestamp,
      suggestions: msg.suggestions,
      isError: msg.isError,
      isSuccess: msg.isSuccess,
      metadata: msg.metadata
    }));
  }

  async getUserSessions(userId: string): Promise<any[]> {
    const sessions = await ChatSession.find({ userId })
      .sort({ lastActivity: -1 })
      .limit(20)
      .select('-__v');

    return sessions.map(session => ({
      id: session._id,
      title: session.title,
      messageCount: session.messageCount,
      lastActivity: session.lastActivity,
      isActive: session.isActive
    }));
  }

  async endChatSession(sessionId: string): Promise<void> {
    const session = await ChatSession.findById(sessionId);
    if (session) {
      session.isActive = false;
      if (session.metadata) {
        session.metadata.sessionDuration = 
          Date.now() - new Date(session.createdAt).getTime();
      }
      await session.save();
    }
  }

  async getSystemHealth(): Promise<{
    database: boolean;
    googleSheets: boolean;
    aiService: boolean;
  }> {
    try {
      // Test database connection
      const dbHealth = await User.findOne().limit(1);
      
      // Test Google Sheets connection
      const sheetsHealth = await this.sheetsService.testConnection();
      
      // Test AI service (simple test)
      let aiHealth = false;
      try {
        await this.aiService.generateResponse('test', {
          userId: 'test',
          userName: 'test'
        });
        aiHealth = true;
      } catch {
        aiHealth = false;
      }

      return {
        database: !!dbHealth || true, // Allow if no users exist yet
        googleSheets: sheetsHealth.success,
        aiService: aiHealth
      };
    } catch (error) {
      console.error('Error checking system health:', error);
      return {
        database: false,
        googleSheets: false,
        aiService: false
      };
    }
  }

  async initializeGoogleSheetsStructure(): Promise<GoogleSheetsResponse> {
    return await this.sheetsService.createWorksheetStructure();
  }

  async analyzeUserIntent(message: string) {
    return await this.aiService.analyzeUserIntent(message);
  }

  async generateContextualSuggestions(conversationHistory: string[], academicData?: AcademicData) {
    return await this.aiService.generateContextualSuggestions(conversationHistory, academicData);
  }
}