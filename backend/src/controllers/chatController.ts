import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ChatbotService } from '../services/ChatbotService';

const chatbotService = new ChatbotService();

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message, sessionId, academicData } = req.body;
    const userId = req.user!.id;

    let activeSessionId = sessionId;

    // Create new session if none provided
    if (!activeSessionId) {
      activeSessionId = await chatbotService.createChatSession(
        userId,
        req.headers['user-agent'],
        req.ip
      );
    }

    // Process the message
    const result = await chatbotService.processMessage(
      userId,
      activeSessionId,
      message,
      { academicData }
    );

    res.json({
      success: true,
      data: {
        sessionId: activeSessionId,
        messageId: result.messageId,
        response: {
          content: result.botResponse.content,
          suggestions: result.botResponse.suggestions,
          action: result.botResponse.action,
          sheetsSync: result.botResponse.sheetsAction
        },
        sheetsResponse: result.sheetsResponse
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message'
    });
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const { limit = '50' } = req.query;
    const userId = req.user!.id;

    const messages = await chatbotService.getChatHistory(
      userId,
      sessionId,
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: {
        messages,
        sessionId,
        count: messages.length
      }
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve chat history'
    });
  }
};

export const getUserSessions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const sessions = await chatbotService.getUserSessions(userId);

    res.json({
      success: true,
      data: {
        sessions,
        count: sessions.length
      }
    });
  } catch (error) {
    console.error('Get user sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user sessions'
    });
  }
};

export const createSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const sessionId = await chatbotService.createChatSession(
      userId,
      req.headers['user-agent'],
      req.ip
    );

    res.status(201).json({
      success: true,
      data: {
        sessionId,
        message: 'Chat session created successfully'
      }
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create chat session'
    });
  }
};

export const endSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;

    await chatbotService.endChatSession(sessionId);

    res.json({
      success: true,
      message: 'Chat session ended successfully'
    });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to end chat session'
    });
  }
};

export const analyzeIntent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({
        success: false,
        error: 'Message is required'
      });
      return;
    }

    const analysis = await chatbotService.analyzeUserIntent(message);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Analyze intent error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze intent'
    });
  }
};

export const getSystemHealth = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const health = await chatbotService.getSystemHealth();

    const overallHealth = Object.values(health).every(status => status);

    res.json({
      success: true,
      data: {
        ...health,
        overall: overallHealth,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get system health error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check system health'
    });
  }
};

export const initializeSheets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await chatbotService.initializeGoogleSheetsStructure();

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Initialize sheets error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize Google Sheets structure'
    });
  }
};