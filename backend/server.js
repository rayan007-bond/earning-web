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

// SMTP diagnostic endpoint (temporary - remove after debugging)
app.get('/api/smtp-check', async (req, res) => {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const result = {
        SMTP_USER_set: !!smtpUser,
        SMTP_USER_value: smtpUser || 'NOT SET',
        SMTP_PASS_set: !!smtpPass,
        SMTP_PASS_length: smtpPass ? smtpPass.replace(/\s+/g, '').length : 0,
        SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com (default)',
        SMTP_PORT: process.env.SMTP_PORT || '587 (default)',
    };

    // Try to verify SMTP connection
    try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: { user: smtpUser, pass: smtpPass ? smtpPass.replace(/\s+/g, '') : undefined },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000
        });
        await transporter.verify();
        result.smtp_connection = '✅ VERIFIED';
    } catch (e) {
        result.smtp_connection = `❌ FAILED: ${e.message}`;
    }

    res.json(result);
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
    await ensureOfferwallTables();

    // Ensure device_id column exists in users table
    try {
        await pool.query('ALTER TABLE users ADD COLUMN device_id VARCHAR(255) DEFAULT NULL');
        console.log('✅ Added device_id column to users table');
    } catch (e) {
        // Column already exists - ignore
    }

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
            // Ensure admin is active but DO NOT reset password
            // (password can now be changed from the Settings page)
            await pool.query(
                'UPDATE admin_users SET status = ? WHERE email = ? AND status != ?',
                ['active', email, 'active']
            );
            console.log(`👤 Admin user verified: ${email}`);
        }
    } catch (error) {
        console.error('⚠️  Admin setup warning:', error.message);
    }
}

// Auto-create offerwall tables and seed default networks on startup
async function ensureOfferwallTables() {
    try {
        // Create offerwall_networks table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS offerwall_networks (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(50) NOT NULL UNIQUE,
                display_name VARCHAR(100) NOT NULL,
                description TEXT,
                logo_url VARCHAR(500),
                secret_key VARCHAR(255) NOT NULL,
                payout_percent DECIMAL(5,2) DEFAULT 70.00,
                hash_method ENUM('md5', 'sha256', 'sha1') DEFAULT 'md5',
                ip_whitelist TEXT,
                offerwall_url VARCHAR(1000),
                postback_url VARCHAR(500),
                status ENUM('active', 'inactive', 'testing') DEFAULT 'active',
                total_earnings DECIMAL(12,2) DEFAULT 0.00,
                total_conversions INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create offerwall_transactions table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS offerwall_transactions (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                network_id INT NOT NULL,
                network_name VARCHAR(50) NOT NULL,
                transaction_id VARCHAR(255) NOT NULL,
                offer_id VARCHAR(255),
                offer_name VARCHAR(500),
                payout DECIMAL(10,4) NOT NULL,
                credited_amount DECIMAL(10,4) NOT NULL,
                admin_profit DECIMAL(10,4) NOT NULL,
                currency VARCHAR(10) DEFAULT 'USD',
                ip_address VARCHAR(45),
                user_agent TEXT,
                raw_data TEXT,
                status ENUM('credited', 'pending', 'rejected', 'duplicate', 'invalid_signature', 'user_not_found') DEFAULT 'pending',
                error_message VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (network_id) REFERENCES offerwall_networks(id) ON DELETE CASCADE,
                
                UNIQUE KEY unique_network_transaction (network_id, transaction_id),
                INDEX idx_user_id (user_id),
                INDEX idx_network_id (network_id),
                INDEX idx_status (status),
                INDEX idx_created_at (created_at)
            )
        `);

        // Insert default networks
        const networks = [
            ['adgate', 'AdGate Media', 'Complete surveys, watch videos, and download apps to earn rewards.', 'CHANGE_ME_ADGATE_SECRET', 70.00, 'md5', 'https://wall.adgaterewards.com/{wall_id}/{user_id}'],
            ['cpx', 'CPX Research', 'Premium surveys with high payouts. Share your opinion and get paid.', 'CHANGE_ME_CPX_SECRET', 70.00, 'md5', 'https://offers.cpx-research.com/index.php?app_id={app_id}&ext_user_id={user_id}'],
            ['timewall', 'TimeWall', 'Complete timed offers and earn money while you wait.', 'CHANGE_ME_TIMEWALL_SECRET', 70.00, 'sha256', 'https://timewall.io/offers?user_id={user_id}&pub_id={pub_id}'],
            ['offertoro', 'OfferToro', 'Complete offers, surveys, and tasks to earn rewards instantly.', 'CHANGE_ME_OFFERTORO_SECRET', 70.00, 'md5', 'https://www.offertoro.com/ifr/show/{pub_id}/{user_id}/0'],
            ['lootably', 'Lootably', 'Discover new apps, games, and offers while earning rewards.', 'CHANGE_ME_LOOTABLY_SECRET', 70.00, 'sha256', 'https://wall.lootably.com/?placementID={placement_id}&sid={user_id}']
        ];

        for (const network of networks) {
            try {
                await pool.query(
                    `INSERT INTO offerwall_networks (name, display_name, description, secret_key, payout_percent, hash_method, offerwall_url)
                     VALUES (?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE display_name = VALUES(display_name)`,
                    network
                );
            } catch (err) {
                // Ignore duplicates
            }
        }

        // Ensure offerwall_earnings column exists
        try {
            await pool.query('ALTER TABLE users ADD COLUMN offerwall_earnings DECIMAL(12,4) DEFAULT 0.0000');
        } catch (err) {
            // Ignore error if column already exists
        }

        console.log('✅ Offerwall tables verified');
    } catch (error) {
        console.error('⚠️  Offerwall setup warning:', error.message);
    }
}

startServer();

module.exports = app;
