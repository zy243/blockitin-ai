import { GoogleSheetsData, GoogleSheetsResponse, AcademicData } from '../types';
export declare class GoogleSheetsService {
    private sheets;
    private auth;
    constructor();
    private initializeAuth;
    testConnection(): Promise<GoogleSheetsResponse>;
    saveToSheet(sheetName: string, data: any[]): Promise<GoogleSheetsResponse>;
    getFromSheet(sheetName: string, range: string): Promise<GoogleSheetsResponse>;
    logChatInteraction(data: GoogleSheetsData): Promise<GoogleSheetsResponse>;
    logNavigation(userId: string, section: string, action: string, query?: string): Promise<GoogleSheetsResponse>;
    syncAcademicData(userId: string, academicData: AcademicData): Promise<GoogleSheetsResponse>;
    trackUserAnalytics(userId: string, analyticsData: any): Promise<GoogleSheetsResponse>;
    createWorksheetStructure(): Promise<GoogleSheetsResponse>;
    private ensureSheetExists;
    generateAnalyticsReport(userId: string): Promise<GoogleSheetsResponse>;
}
//# sourceMappingURL=GoogleSheetsService.d.ts.map