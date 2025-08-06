import mongoose, { Schema, Document } from 'mongoose';

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

const messageSchema = new Schema<IMessage>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: 'ChatSession',
    required: true
  },
  type: {
    type: String,
    enum: ['user', 'bot', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  suggestions: [{
    type: String,
    trim: true
  }],
  isError: {
    type: Boolean,
    default: false
  },
  isSuccess: {
    type: Boolean,
    default: false
  },
  metadata: {
    action: String,
    section: String,
    itemId: String,
    sheetsSync: Boolean,
    aiModel: String,
    processingTime: Number
  }
}, {
  timestamps: true
});

// Index for efficient querying
messageSchema.index({ userId: 1, timestamp: -1 });
messageSchema.index({ sessionId: 1, timestamp: 1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);