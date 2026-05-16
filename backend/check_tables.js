const { pool } = require('./config/database');

async function showTables() {
    const [tables] = await pool.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    
    for (const table of tableNames) {
        const [columns] = await pool.query(`SHOW COLUMNS FROM ${table}`);
        const hasUserId = columns.some(c => c.Field === 'user_id' || c.Field === 'referrer_id' || c.Field === 'referred_id');
        if (hasUserId) {
            console.log(`Table ${table} has user reference`);
        }
    }
    process.exit(0);
}
showTables();
