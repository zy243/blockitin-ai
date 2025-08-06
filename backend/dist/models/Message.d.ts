import mongoose, { Document } from 'mongoose';
export interface IMessage extends Document {
    userId: mongoose.Types.ObjectId;
    sessionId: mongoose.Types.ObjectId;
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
        aiModel?: string;
        processingTime?: number;
    };
}
export declare const Message: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}, {}> & IMessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Message.d.ts.map