"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSheetsService = void 0;
const googleapis_1 = require("googleapis");
class GoogleSheetsService {
    constructor() {
        this.initializeAuth();
    }
    initializeAuth() {
        try {
            // Initialize JWT auth with service account
            this.auth = new googleapis_1.google.auth.JWT({
                email: process.env.GOOGLE_CLIENT_EMAIL,
                key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                scopes: ['https://www.googleapis.com/auth/spreadsheets']
            });
            this.sheets = googleapis_1.google.sheets({ version: 'v4', auth: this.auth });
        }
        catch (error) {
            console.error('Error initializing Google Sheets auth:', error);
        }
    }
    async testConnection() {
        try {
            const response = await this.sheets.spreadsheets.get({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
            });
            return {
                success: true,
                message: 'Successfully connected to Google Sheets',
                data: {
                    title: response.data.properties.title,
                    sheets: response.data.sheets.map((sheet) => sheet.properties.title)
                }
            };
        }
        catch (error) {
            console.error('Google Sheets connection test failed:', error);
            return {
                success: false,
                error: 'Failed to connect to Google Sheets'
            };
        }
    }
    async saveToSheet(sheetName, data) {
        try {
            const response = await this.sheets.spreadsheets.values.append({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: `${sheetName}!A:Z`,
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [data]
                }
            });
            return {
                success: true,
                message: 'Data successfully saved to Google Sheets',
                data: response.data
            };
        }
        catch (error) {
            console.error('Error saving to Google Sheets:', error);
            return {
                success: false,
                error: 'Failed to save data to Google Sheets'
            };
        }
    }
    async getFromSheet(sheetName, range) {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: `${sheetName}!${range}`
            });
            return {
                success: true,
                message: 'Data successfully retrieved from Google Sheets',
                data: response.data.values
            };
        }
        catch (error) {
            console.error('Error getting from Google Sheets:', error);
            return {
                success: false,
                error: 'Failed to retrieve data from Google Sheets'
            };
        }
    }
    async logChatInteraction(data) {
        const rowData = [
            new Date().toISOString(),
            data.user,
            data.action,
            JSON.stringify(data.data),
            data.source
        ];
        return this.saveToSheet('ChatLogs', rowData);
    }
    async logNavigation(userId, section, action, query) {
        const rowData = [
            new Date().toISOString(),
            userId,
            'navigation',
            section,
            action,
            query || '',
            'Blockitin AI Chatbot'
        ];
        return this.saveToSheet('NavigationLogs', rowData);
    }
    async syncAcademicData(userId, academicData) {
        const rowData = [
            new Date().toISOString(),
            userId,
            academicData.credentials,
            academicData.gpa,
            academicData.wellness_score,
            academicData.assignments,
            academicData.health_records,
            'Full Sync'
        ];
        return this.saveToSheet('AcademicData', rowData);
    }
    async trackUserAnalytics(userId, analyticsData) {
        const rowData = [
            new Date().toISOString(),
            userId,
            analyticsData.totalMessages || 0,
            analyticsData.sessionsCount || 0,
            analyticsData.sheetsInteractions || 0,
            JSON.stringify(analyticsData.favoriteFeatures || []),
            'Analytics Update'
        ];
        return this.saveToSheet('UserAnalytics', rowData);
    }
    async createWorksheetStructure() {
        try {
            // Create or update worksheet headers
            const sheets = [
                {
                    name: 'ChatLogs',
                    headers: ['Timestamp', 'User', 'Action', 'Data', 'Source']
                },
                {
                    name: 'NavigationLogs',
                    headers: ['Timestamp', 'UserId', 'Type', 'Section', 'Action', 'Query', 'Source']
                },
                {
                    name: 'AcademicData',
                    headers: ['Timestamp', 'UserId', 'Credentials', 'GPA', 'Wellness Score', 'Assignments', 'Health Records', 'Sync Type']
                },
                {
                    name: 'UserAnalytics',
                    headers: ['Timestamp', 'UserId', 'Total Messages', 'Sessions Count', 'Sheets Interactions', 'Favorite Features', 'Update Type']
                }
            ];
            for (const sheet of sheets) {
                await this.ensureSheetExists(sheet.name, sheet.headers);
            }
            return {
                success: true,
                message: 'Worksheet structure created successfully'
            };
        }
        catch (error) {
            console.error('Error creating worksheet structure:', error);
            return {
                success: false,
                error: 'Failed to create worksheet structure'
            };
        }
    }
    async ensureSheetExists(sheetName, headers) {
        try {
            // Check if sheet exists
            const spreadsheet = await this.sheets.spreadsheets.get({
                spreadsheetId: process.env.GOOGLE_SHEET_ID
            });
            const sheetExists = spreadsheet.data.sheets.some((sheet) => sheet.properties.title === sheetName);
            if (!sheetExists) {
                // Create new sheet
                await this.sheets.spreadsheets.batchUpdate({
                    spreadsheetId: process.env.GOOGLE_SHEET_ID,
                    resource: {
                        requests: [{
                                addSheet: {
                                    properties: {
                                        title: sheetName
                                    }
                                }
                            }]
                    }
                });
                // Add headers
                await this.sheets.spreadsheets.values.update({
                    spreadsheetId: process.env.GOOGLE_SHEET_ID,
                    range: `${sheetName}!A1:${String.fromCharCode(65 + headers.length - 1)}1`,
                    valueInputOption: 'USER_ENTERED',
                    resource: {
                        values: [headers]
                    }
                });
            }
        }
        catch (error) {
            console.error(`Error ensuring sheet ${sheetName} exists:`, error);
        }
    }
    async generateAnalyticsReport(userId) {
        try {
            // Get data from various sheets
            const chatLogs = await this.getFromSheet('ChatLogs', 'A:E');
            const navigationLogs = await this.getFromSheet('NavigationLogs', 'A:G');
            const academicData = await this.getFromSheet('AcademicData', 'A:H');
            const report = {
                generatedAt: new Date().toISOString(),
                userId,
                totalInteractions: chatLogs.data?.length || 0,
                navigationCount: navigationLogs.data?.length || 0,
                lastAcademicSync: academicData.data?.[academicData.data.length - 1]?.[0] || 'Never',
                summary: 'Comprehensive analytics report generated'
            };
            // Save report to a new sheet
            const reportRowData = [
                report.generatedAt,
                report.userId,
                report.totalInteractions,
                report.navigationCount,
                report.lastAcademicSync,
                report.summary
            ];
            await this.saveToSheet('AnalyticsReports', reportRowData);
            return {
                success: true,
                message: 'Analytics report generated successfully',
                data: report
            };
        }
        catch (error) {
            console.error('Error generating analytics report:', error);
            return {
                success: false,
                error: 'Failed to generate analytics report'
            };
        }
    }
}
exports.GoogleSheetsService = GoogleSheetsService;
//# sourceMappingURL=GoogleSheetsService.js.map