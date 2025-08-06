export interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  userId: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  isError?: boolean;
  isSuccess?: boolean;
  metadata?: {
    action?: string;
    section?: string;
    itemId?: string;
    sheetsSync?: boolean;
  };
}

export interface ChatSession {
  _id: string;
  userId: string;
  messages: Message[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoogleSheetsData {
  action: string;
  data: any;
  timestamp: string;
  user: string;
  source: string;
}

export interface GoogleSheetsResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export interface AIResponse {
  content: string;
  suggestions?: string[];
  action?: {
    type: string;
    section: string;
    itemId?: string;
  };
  sheetsAction?: boolean;
}

export interface AcademicData {
  credentials: number;
  gpa: number;
  wellness_score: number;
  assignments: number;
  health_records: number;
}

export interface UserAnalytics {
  userId: string;
  totalMessages: number;
  sessionsCount: number;
  lastActiveAt: Date;
  favoriteFeatures: string[];
  sheetsInteractions: number;
}