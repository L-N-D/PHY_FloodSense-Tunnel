import express, { json } from 'express';
import cors from 'cors';
import cookiesParser from 'cookie-parser';
import commonRoute from './routes/index.js';

const app = express();
app.use(cors({
    origin: "http://localhost:3000",   // domain FE
    credentials: true,                 // QUAN TRỌNG
}));
app.use(json());
app.use(cookiesParser());

app.use('/api', commonRoute);

export default app;