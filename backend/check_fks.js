const { pool } = require('./config/database');

async function showFKs() {
    try {
        const [rows] = await pool.query(`
            SELECT TABLE_NAME, COLUMN_NAME 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE REFERENCED_TABLE_SCHEMA = 'gpt_earn' 
            AND REFERENCED_TABLE_NAME = 'users'
        `);
        console.log(rows);
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
showFKs();
