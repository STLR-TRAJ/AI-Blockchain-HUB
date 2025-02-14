const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const db = require('./JS/config/database');
const authRoutes = require('./routes/authRoutes');
const voteRoutes = require('./routes/voteRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization
app.use(mongoSanitize()); // Against NoSQL query injection
app.use(xss()); // Against XSS
app.use(hpp()); // Against HTTP Parameter Pollution

// Compression and logging
app.use(compression());
app.use(morgan('dev'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/transactions', transactionRoutes);

// Error handling
app.use(errorHandler);

// Database connection and server start
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await db.connect();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(err);
    process.exit(1);
}); 