import { AcademicData } from '../models';
import { AIResponse, GoogleSheetsResponse } from '../types';
export declare class ChatbotService {
    private aiService;
    private sheetsService;
    constructor();
    processMessage(userId: string, sessionId: string, messageContent: string, userContext?: any): Promise<{
        botResponse: AIResponse;
        sheetsResponse?: GoogleSheetsResponse;
        messageId: string;
    }>;
    private handleSheetsAction;
    private updateChatSession;
    createChatSession(userId: string, userAgent?: string, ipAddress?: string): Promise<string>;
    getChatHistory(userId: string, sessionId: string, limit?: number): Promise<any[]>;
    getUserSessions(userId: string): Promise<any[]>;
    endChatSession(sessionId: string): Promise<void>;
    getSystemHealth(): Promise<{
        database: boolean;
        googleSheets: boolean;
        aiService: boolean;
    }>;
    initializeGoogleSheetsStructure(): Promise<GoogleSheetsResponse>;
    analyzeUserIntent(message: string): Promise<{
        intent: string;
        entities: string[];
        confidence: number;
    }>;
    generateContextualSuggestions(conversationHistory: string[], academicData?: AcademicData): Promise<string[]>;
}
//# sourceMappingURL=ChatbotService.d.ts.map