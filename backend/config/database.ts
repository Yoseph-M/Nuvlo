import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nuvlo");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`\x1b[33m⚠️  Warning: MongoDB connection failed (${error.message}). Running server without active database connection.\x1b[0m`);
  }
};

export default connectDB;
