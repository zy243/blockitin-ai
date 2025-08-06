import { Request, Response, NextFunction } from 'express';
export declare const apiLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const chatLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const validateChatMessage: (req: Request, res: Response, next: NextFunction) => void;
export declare const sanitizeInput: (req: Request, res: Response, next: NextFunction) => void;
export declare const corsOptions: {
    origin: (origin: string | undefined, callback: Function) => any;
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
};
//# sourceMappingURL=security.d.ts.map