const { query } = require('./config/database');

const createMissingTable = async () => {
    try {
        console.log('🔍 Checking for missing user_daily_limits table...');
        
        const sql = `
            CREATE TABLE IF NOT EXISTS user_daily_limits (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                reset_date DATE NOT NULL,
                tasks_completed INT DEFAULT 0,
                offers_completed INT DEFAULT 0,
                cooldown_until DATETIME DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_user_reset (user_id, reset_date),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        
        await query(sql);
        console.log('✅ Table user_daily_limits is ready.');
    } catch (error) {
        console.error('❌ Error creating user_daily_limits table:', error);
    }
};

module.exports = { createMissingTable };
