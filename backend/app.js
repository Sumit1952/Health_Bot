import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import symptomRoutes from './routes/symptomRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure DB connection on each request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// API Routes
app.use('/api/symptoms', symptomRoutes);
app.use('/symptoms', symptomRoutes);

// Health Check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'OK', message: 'HealthifyMe MERN API is running' });
});

export default app;
