import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import handloomRoutes from './routes/handloomRoutes.js';
import directoryRoutes from './routes/directoryRoutes.js';
import jobsRoutes from './routes/jobsRoutes.js';
import noticesRoutes from './routes/noticesRoutes.js';
import tickerRoutes from './routes/tickerRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Restrict payload size to prevent DoS attacks

// Rate Limiting — Max 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

app.use('/api/', apiLimiter);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/handloom', handloomRoutes);
app.use('/api/v1/directory', directoryRoutes);
app.use('/api/v1/jobs', jobsRoutes);
app.use('/api/v1/notices', noticesRoutes);
app.use('/api/v1/ticker', tickerRoutes);
app.use('/api/v1/payment', paymentRoutes);

// System Healthcheck Endpoint
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    platform: 'Lamka Hub Backend API Server (Churachandpur)',
    timestamp: new Date().toISOString(),
    database: 'Supabase PostgreSQL',
    authProvider: 'WhatsApp OTP Gateway',
    paymentGateway: 'Razorpay Security Verified',
    version: '1.1.0',
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Lamka Hub Express Security Backend Server Running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🏥 Healthcheck: http://localhost:${PORT}/api/v1/health`);
  console.log(`💳 Payment Gateway: Razorpay API Ready`);
  console.log(`💬 WhatsApp OTP Mode: ${process.env.WHATSAPP_MODE || 'development'}`);
  console.log(`==================================================\n`);
});
