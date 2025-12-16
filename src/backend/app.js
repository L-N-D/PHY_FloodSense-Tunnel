import express, { json } from 'express';
import cors from 'cors';
import cookiesParser from 'cookie-parser';
import commonRoute from './routes/index.js';

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// app.use(cors({
//     origin: "*",
//     methods: "GET,POST,PUT,DELETE,OPTIONS",
//     allowedHeaders: "Content-Type, Authorization",
//     credentials: true
// }));

app.use(json());
app.use(cookiesParser());

app.use('/api', commonRoute);

export default app;
