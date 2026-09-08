import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthifyme';
    const conn = await mongoose.connect(connStr);
    isConnected = true;
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB] Warning: Could not connect to MongoDB (${error.message}). Continuing without persistent logging.`);
  }
};

