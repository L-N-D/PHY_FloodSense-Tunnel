import express, { json } from 'express';
import cors from 'cors';
import cookiesParser from 'cookie-parser';
import commonRoute from './routes/index.js';
import dotenv from 'dotenv';
dotenv.config();

const client = process.env.NEXT_PUBLIC_FRONTEND_URL;

const app = express();
app.use(cors({
    origin: client,
    credentials: true,
}));
app.use(json());
app.use(cookiesParser());

app.use('/api', commonRoute);

export default app;
