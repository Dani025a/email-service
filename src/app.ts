import express from 'express';
import dotenv from 'dotenv';
import { startEmailReceiver } from './rabbitmq/emailReveiver';

dotenv.config();

startEmailReceiver();

const app = express();

app.use(express.json());

export default app;
