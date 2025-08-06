"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabaseConnection = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blockitin-chatbot';
        await mongoose_1.default.connect(mongoUri);
        console.log('✅ Connected to MongoDB successfully');
        // Handle connection events
        mongoose_1.default.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });
        process.on('SIGINT', async () => {
            await mongoose_1.default.connection.close();
            console.log('📦 MongoDB connection closed through app termination');
            process.exit(0);
        });
    }
    catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
const closeDatabaseConnection = async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log('📦 MongoDB connection closed');
    }
    catch (error) {
        console.error('❌ Error closing MongoDB connection:', error);
    }
};
exports.closeDatabaseConnection = closeDatabaseConnection;
//# sourceMappingURL=database.js.map