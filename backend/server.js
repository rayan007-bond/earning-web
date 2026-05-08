const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { pool, testConnection } = require('./config/database');
const { createMissingTable } = require('./init_db');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/tasks');
const vipRoutes = require('./routes/vip');
const referralRoutes = require('./routes/referrals');
const withdrawalRoutes = require('./routes/withdrawals');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');
const postbackRoutes = require('./routes/postback');
const offerwallRoutes = require('./routes/offerwalls');

// Import cron jobs
const cronJobs = require('./cron/jobs');

const app = express();
app.set('trust proxy', 1); // Trust Railway's proxy for rate limiting

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "blob:", "http://localhost:*", "https://*"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        },
    },
}));
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        // Allow localhost on any port
        if (origin.match(/^http:\/\/localhost:\d+$/)) {
            return callback(null, true);
        }
        // Allow Railway, Vercel, Netlify, and custom domains
        if (origin.match(/\.up\.railway\.app$/) ||
            origin.match(/\.vercel\.app$/) ||
            origin.match(/\.netlify\.app$/) ||
            origin.match(/\.infinityfreeapp\.com$/) ||
            origin === process.env.CORS_ORIGIN) {
            return callback(null, true);
        }
        // In production, allow all origins (for demo purposes)
        if (process.env.NODE_ENV === 'production') {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/vip', vipRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/offerwalls', offerwallRoutes);
app.use('/postback', postbackRoutes);  // Postback endpoints (no /api prefix for offerwall callbacks)

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await createMissingTable();
    await testConnection();
    await ensureAdminExists();

    // Start cron jobs
    cronJobs.start();

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ Database connected successfully`);
        console.log(`⏰ Cron jobs started`);
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 Listening on 0.0.0.0:${PORT}`);
    });
};

// Auto-create or fix admin user on startup (works on fresh AND existing databases)
async function ensureAdminExists() {
    try {
        // Ensure admin_users table exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS admin_users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(100) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('admin', 'super_admin') DEFAULT 'super_admin',
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const email = process.env.ADMIN_EMAIL || 'admin@gpt-earn.com';
        const password = process.env.ADMIN_PASSWORD || 'admin123';
        const hash = await bcrypt.hash(password, 10);

        // Check if admin with this email exists
        const [admins] = await pool.query('SELECT id FROM admin_users WHERE email = ?', [email]);
        
        if (admins.length === 0) {
            // Create new admin
            await pool.query(
                'INSERT INTO admin_users (email, username, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
                [email, 'SuperAdmin', hash, 'super_admin', 'active']
            );
            console.log(`👤 Admin user created: ${email}`);
        } else {
            // Always reset password & ensure active status on startup
            await pool.query(
                'UPDATE admin_users SET password_hash = ?, status = ? WHERE email = ?',
                [hash, 'active', email]
            );
            console.log(`👤 Admin user verified & password synced: ${email}`);
        }
    } catch (error) {
        console.error('⚠️  Admin setup warning:', error.message);
    }
}

startServer();

module.exports = app;
