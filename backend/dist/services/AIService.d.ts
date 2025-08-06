import { AIResponse, AcademicData } from '../types';
export declare class AIService {
    private openai;
    constructor();
    generateResponse(userMessage: string, context: {
        userId: string;
        userName: string;
        conversationHistory?: string[];
        academicData?: AcademicData;
    }): Promise<AIResponse>;
    private buildSystemPrompt;
    private buildUserPrompt;
    private parseAIResponse;
    private generateDefaultSuggestions;
    private getFallbackResponse;
    analyzeUserIntent(message: string): Promise<{
        intent: string;
        entities: string[];
        confidence: number;
    }>;
    generateContextualSuggestions(conversationHistory: string[], academicData?: AcademicData): Promise<string[]>;
}
//# sourceMappingURL=AIService.d.ts.map