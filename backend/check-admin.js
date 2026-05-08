// Quick diagnostic script to check admin login
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkAdmin() {
    console.log('Connecting to database...');
    console.log('Host:', process.env.DB_HOST);
    console.log('Database:', process.env.DB_NAME);
    
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        // 1. Check if admin_users table exists
        const [tables] = await pool.query("SHOW TABLES LIKE 'admin_users'");
        if (tables.length === 0) {
            console.log('\n❌ admin_users TABLE DOES NOT EXIST!');
            console.log('Creating it now...');
            await pool.query(`
                CREATE TABLE admin_users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    username VARCHAR(100) NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    role ENUM('admin', 'super_admin') DEFAULT 'super_admin',
                    status ENUM('active', 'inactive') DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('✅ admin_users table created!');
        } else {
            console.log('\n✅ admin_users table exists');
        }

        // 2. Check if admin user exists
        const [admins] = await pool.query('SELECT * FROM admin_users');
        console.log(`\nFound ${admins.length} admin user(s):`);
        
        if (admins.length === 0) {
            console.log('⚠️  No admin users found! Creating one...');
            const hash = await bcrypt.hash('admin123', 10);
            await pool.query(
                'INSERT INTO admin_users (email, username, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
                ['admin@gpt-earn.com', 'SuperAdmin', hash, 'super_admin', 'active']
            );
            console.log('✅ Admin user created!');
        } else {
            for (const admin of admins) {
                console.log(`  - ID: ${admin.id}, Email: ${admin.email}, Status: ${admin.status}, Role: ${admin.role}`);
                
                // Test password
                const isMatch = await bcrypt.compare('admin123', admin.password_hash);
                console.log(`    Password 'admin123' match: ${isMatch ? '✅ YES' : '❌ NO'}`);
                
                if (!isMatch) {
                    console.log('    Resetting password to admin123...');
                    const newHash = await bcrypt.hash('admin123', 10);
                    await pool.query('UPDATE admin_users SET password_hash = ?, status = ? WHERE id = ?', [newHash, 'active', admin.id]);
                    console.log('    ✅ Password reset!');
                }
            }
        }

        console.log('\n========================================');
        console.log('Admin Login Credentials:');
        console.log('Email:    admin@gpt-earn.com');
        console.log('Password: admin123');
        console.log('========================================');

        await pool.end();
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

checkAdmin();
