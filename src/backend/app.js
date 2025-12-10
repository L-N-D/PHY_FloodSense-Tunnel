import express, { json } from 'express';
import cors from 'cors';
import cookiesParser from 'cookie-parser';
import commonRoute from './routes/index.js';

const app = express();
// app.use(cors({
//     origin: '*',
//     credentials: true
// }));

app.use(cors({
    origin: "http://192.168.102.11:3000",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true
}));

app.use(json());
app.use(cookiesParser());

app.use('/api', commonRoute);

export default app;