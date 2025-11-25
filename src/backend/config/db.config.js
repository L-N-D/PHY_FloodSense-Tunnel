import mongoose from 'mongoose';
import { MONGO_URL } from './env.config.js';
import User from '../modules/user/user.model.js';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;