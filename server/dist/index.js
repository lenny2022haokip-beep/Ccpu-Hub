"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const handloomRoutes_js_1 = __importDefault(require("./routes/handloomRoutes.js"));
const directoryRoutes_js_1 = __importDefault(require("./routes/directoryRoutes.js"));
const jobsRoutes_js_1 = __importDefault(require("./routes/jobsRoutes.js"));
const noticesRoutes_js_1 = __importDefault(require("./routes/noticesRoutes.js"));
const tickerRoutes_js_1 = __importDefault(require("./routes/tickerRoutes.js"));
const paymentRoutes_js_1 = __importDefault(require("./routes/paymentRoutes.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10kb' })); // Restrict payload size to prevent DoS attacks
// Rate Limiting — Max 100 requests per 15 minutes per IP
const apiLimiter = (0, express_rate_limit_1.default)({
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
app.use('/api/v1/auth', authRoutes_js_1.default);
app.use('/api/v1/handloom', handloomRoutes_js_1.default);
app.use('/api/v1/directory', directoryRoutes_js_1.default);
app.use('/api/v1/jobs', jobsRoutes_js_1.default);
app.use('/api/v1/notices', noticesRoutes_js_1.default);
app.use('/api/v1/ticker', tickerRoutes_js_1.default);
app.use('/api/v1/payment', paymentRoutes_js_1.default);
// System Healthcheck Endpoint
app.get('/api/v1/health', (req, res) => {
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
app.use((err, req, res, next) => {
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
