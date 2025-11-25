import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.DB_PORT || 1307;
export const MONGO_URL = process.env.MONGO_URL;
export const JWT_SECRET = process.env.JWT_SECRET || 'dbSecret';
