import express, { json } from 'express';
import cors from 'cors';
import commonRoute from './routes/index.js';

const app = express();
app.use(cors);
app.use(json());

app.use('/api', commonRoute);

export default app;