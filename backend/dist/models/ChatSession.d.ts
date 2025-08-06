import mongoose, { Document } from 'mongoose';
export interface IChatSession extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    isActive: boolean;
    messageCount: number;
    lastActivity: Date;
    metadata?: {
        userAgent?: string;
        ipAddress?: string;
        sessionDuration?: number;
        sheetsInteractions?: number;
    };
}
export declare const ChatSession: mongoose.Model<IChatSession, {}, {}, {}, mongoose.Document<unknown, {}, IChatSession, {}, {}> & IChatSession & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=ChatSession.d.ts.map