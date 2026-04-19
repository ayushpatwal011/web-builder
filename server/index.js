import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import websiteRouter from './routes/website.route.js';
import billingRouter from './routes/billing.route.js';
import { stripeWebhook } from './controllers/stripeWebhook.controller.js';

dotenv.config();
const app = express();
app.use(express.json())
app.post('/ai/stripe/webhook', express.raw({type:'application/json'}), stripeWebhook)
const PORT  = process.env.PORT || 8000;

app.use(cookieParser())
app.use(cors({
  origin: 'https://web-builder-1.onrender.com',
  credentials: true
}));

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter )
app.use('/api/website', websiteRouter )
app.use('/api/billing', billingRouter )
app.listen(PORT, ()=>{
	console.log("Server is running at port :", PORT);
	connectDB();
})
