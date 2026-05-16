const { pool } = require('./config/database');

async function addDeviceId() {
    try {
        await pool.query('ALTER TABLE users ADD COLUMN device_id VARCHAR(255) DEFAULT NULL');
        console.log('✅ device_id column added to users table');
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists, skipping.');
        } else {
            console.error('Error:', e.message);
        }
    }
    process.exit(0);
}
addDeviceId();
