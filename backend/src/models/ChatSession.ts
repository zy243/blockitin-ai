import mongoose, { Schema, Document } from 'mongoose';

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

const chatSessionSchema = new Schema<IChatSession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Chat Session',
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  messageCount: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    sessionDuration: Number,
    sheetsInteractions: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for efficient querying
chatSessionSchema.index({ userId: 1, lastActivity: -1 });
chatSessionSchema.index({ isActive: 1 });

// Update lastActivity on save
chatSessionSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

export const ChatSession = mongoose.model<IChatSession>('ChatSession', chatSessionSchema);