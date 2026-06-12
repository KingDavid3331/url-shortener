import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import linksRouter from './routes/links.js';
import redirectRouter from './routes/redirect.js';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/links', linksRouter);
app.use('/', redirectRouter);

export default app;
