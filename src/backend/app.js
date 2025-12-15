import express, { json } from 'express';
import cors from 'cors';
import cookiesParser from 'cookie-parser';
import commonRoute from './routes/index.js';

const app = express();
app.use(cors());
app.use(json());
app.use(cookiesParser());

app.use('/api', commonRoute);

export default app;
