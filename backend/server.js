import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import symptomRoutes from './routes/symptomRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/symptoms', symptomRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HealthifyMe MERN API is running' });
});

app.listen(PORT, () => {
  console.log(`[HealthifyMe Backend] Server listening on http://localhost:${PORT}`);
});
