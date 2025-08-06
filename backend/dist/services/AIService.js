"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const openai_1 = __importDefault(require("openai"));
class AIService {
    constructor() {
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    async generateResponse(userMessage, context) {
        try {
            const systemPrompt = this.buildSystemPrompt(context);
            const userPrompt = this.buildUserPrompt(userMessage, context);
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                max_tokens: 500,
                temperature: 0.7,
            });
            const response = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response at this time.";
            return this.parseAIResponse(response, userMessage);
        }
        catch (error) {
            console.error('Error generating AI response:', error);
            return this.getFallbackResponse(userMessage);
        }
    }
    buildSystemPrompt(context) {
        return `You are Blockitin AI Assistant, a helpful academic companion connected to Google Sheets data integration. 

Your role:
- Help students manage their academic identity and credentials
- Assist with wellness tracking and health passport management
- Support assignment tracking and deadline management
- Facilitate Google Sheets data synchronization
- Provide navigation assistance through the Blockitin platform

User Context:
- Name: ${context.userName}
- User ID: ${context.userId}
- Academic Data: ${context.academicData ? JSON.stringify(context.academicData) : 'Not available'}

Response Guidelines:
1. Be friendly, supportive, and academically focused
2. Always mention Google Sheets integration when relevant
3. Provide actionable suggestions in a "suggestions" array
4. Use emojis appropriately (📚 📊 🎓 💪 🏥 etc.)
5. If navigation is needed, specify the action type and section
6. Keep responses concise but informative
7. Always offer follow-up actions

Format your response as a JSON object with these fields:
{
  "content": "Your main response text",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "action": {
    "type": "navigate", 
    "section": "section_name"
  },
  "sheetsAction": true/false
}

Only include the "action" field if navigation is actually needed.`;
    }
    buildUserPrompt(userMessage, context) {
        let prompt = `User message: "${userMessage}"`;
        if (context.conversationHistory && context.conversationHistory.length > 0) {
            prompt += `\n\nRecent conversation history:\n${context.conversationHistory.join('\n')}`;
        }
        return prompt;
    }
    parseAIResponse(response, userMessage) {
        try {
            // Try to parse as JSON first
            const parsed = JSON.parse(response);
            return {
                content: parsed.content || response,
                suggestions: parsed.suggestions || this.generateDefaultSuggestions(userMessage),
                action: parsed.action,
                sheetsAction: parsed.sheetsAction || false
            };
        }
        catch {
            // If not JSON, treat as plain text and add default suggestions
            return {
                content: response,
                suggestions: this.generateDefaultSuggestions(userMessage),
                sheetsAction: false
            };
        }
    }
    generateDefaultSuggestions(userMessage) {
        const message = userMessage.toLowerCase();
        if (message.includes('credential') || message.includes('nft')) {
            return ["View NFT credentials", "Mint new credential", "Save credentials data"];
        }
        if (message.includes('health') || message.includes('wellness')) {
            return ["Check wellness score", "Add health record", "Export health data"];
        }
        if (message.includes('assignment') || message.includes('homework')) {
            return ["View assignments", "Add new assignment", "Set deadline reminder"];
        }
        if (message.includes('sheet') || message.includes('sync') || message.includes('save')) {
            return ["Sync all data", "Test connection", "View saved data"];
        }
        return [
            "Show my credentials",
            "Save data to Sheets",
            "Check wellness score",
            "View assignments"
        ];
    }
    getFallbackResponse(userMessage) {
        const message = userMessage.toLowerCase();
        // Academic credentials
        if (message.includes('credential') || message.includes('nft') || message.includes('degree')) {
            return {
                content: "I'll help you with your NFT credentials! 🎓 You can view, manage, and mint new academic credentials. Your credential data can also be automatically synced to Google Sheets for backup and analytics.",
                suggestions: ["View NFT credentials", "Mint new credential", "Save to Google Sheets"],
                action: { type: "navigate", section: "credentials" },
                sheetsAction: true
            };
        }
        // Health and wellness
        if (message.includes('health') || message.includes('wellness') || message.includes('medical')) {
            return {
                content: "Let me help you with your Health Passport! 🏥 You can track your wellness score, manage health records, and keep everything synced with Google Sheets for secure access.",
                suggestions: ["Check wellness score", "Add health record", "Sync health data"],
                action: { type: "navigate", section: "health" },
                sheetsAction: true
            };
        }
        // Assignments
        if (message.includes('assignment') || message.includes('homework') || message.includes('project')) {
            return {
                content: "I'll show you your assignment tracker! 📚 You can manage deadlines, track progress, and automatically backup your assignment data to Google Sheets.",
                suggestions: ["View assignments", "Add new assignment", "Save progress to Sheets"],
                action: { type: "navigate", section: "assignments" },
                sheetsAction: true
            };
        }
        // Google Sheets specific
        if (message.includes('sheet') || message.includes('sync') || message.includes('save')) {
            return {
                content: "Perfect! I'll help you with Google Sheets integration. 📊 You can sync all your academic data, create backups, and generate analytics reports directly in your spreadsheet.",
                suggestions: ["Sync all data", "Test connection", "Generate report"],
                sheetsAction: true
            };
        }
        // Greetings
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return {
                content: `Hello! 👋 I'm your Blockitin AI assistant with Google Sheets integration. I can help you manage your academic credentials, track wellness, organize assignments, and sync everything to your spreadsheet. What would you like to do today?`,
                suggestions: ["Show my credentials", "Sync data to Sheets", "Check wellness score", "View assignments"],
                sheetsAction: false
            };
        }
        // Default response
        return {
            content: "I'd be happy to help you with that! I can assist you with managing your academic credentials, tracking wellness, organizing assignments, and syncing everything to Google Sheets. Could you be more specific about what you're looking for?",
            suggestions: ["Show my credentials", "Save data to Sheets", "Check wellness score", "View assignments"],
            sheetsAction: false
        };
    }
    async analyzeUserIntent(message) {
        try {
            const prompt = `Analyze this user message and extract the intent and entities:
      
      Message: "${message}"
      
      Respond with JSON format:
      {
        "intent": "main_intent",
        "entities": ["entity1", "entity2"],
        "confidence": 0.95
      }
      
      Possible intents: greeting, credentials, health, assignments, navigation, sheets_sync, analytics, help`;
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 150,
                temperature: 0.1,
            });
            const response = completion.choices[0]?.message?.content;
            if (response) {
                try {
                    return JSON.parse(response);
                }
                catch {
                    return { intent: "general", entities: [], confidence: 0.5 };
                }
            }
        }
        catch (error) {
            console.error('Error analyzing user intent:', error);
        }
        return { intent: "general", entities: [], confidence: 0.5 };
    }
    async generateContextualSuggestions(conversationHistory, academicData) {
        try {
            const prompt = `Based on this conversation history and academic data, suggest 3-4 relevant follow-up actions:
      
      Conversation: ${conversationHistory.slice(-5).join('\n')}
      Academic Data: ${academicData ? JSON.stringify(academicData) : 'Not available'}
      
      Respond with only a JSON array of strings: ["suggestion1", "suggestion2", "suggestion3"]`;
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 100,
                temperature: 0.7,
            });
            const response = completion.choices[0]?.message?.content;
            if (response) {
                try {
                    return JSON.parse(response);
                }
                catch {
                    return this.generateDefaultSuggestions(conversationHistory[conversationHistory.length - 1] || '');
                }
            }
        }
        catch (error) {
            console.error('Error generating contextual suggestions:', error);
        }
        return this.generateDefaultSuggestions(conversationHistory[conversationHistory.length - 1] || '');
    }
}
exports.AIService = AIService;
//# sourceMappingURL=AIService.js.map