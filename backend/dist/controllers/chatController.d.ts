import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const sendMessage: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getChatHistory: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getUserSessions: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createSession: (req: AuthRequest, res: Response) => Promise<void>;
export declare const endSession: (req: AuthRequest, res: Response) => Promise<void>;
export declare const analyzeIntent: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSystemHealth: (req: AuthRequest, res: Response) => Promise<void>;
export declare const initializeSheets: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=chatController.d.ts.map