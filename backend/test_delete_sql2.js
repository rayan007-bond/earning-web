const { pool } = require('./config/database');

async function testDelete() {
    const userId = 35; // Dummy ID, even if it doesn't exist, we just want to see if queries are valid
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const tablesWithUserRef = [
            'earnings_logs', 'login_logs', 'notifications', 
            'offerwall_transactions', 'payments', 'promo_code_uses', 
            'task_completions', 'task_locks', 'user_daily_limits', 
            'user_vip', 'vip_requests', 'withdrawals'
        ];
        
        for (const table of tablesWithUserRef) {
            try {
                await connection.query(`DELETE FROM ${table} WHERE user_id = ?`, [userId]);
            } catch (err) {
                console.error(`Error deleting from ${table}:`, err.message);
                throw err;
            }
        }
        
        try {
            await connection.query('DELETE FROM referrals WHERE referrer_id = ? OR referred_id = ?', [userId, userId]);
        } catch (err) {
            console.error(`Error deleting from referrals:`, err.message);
            throw err;
        }

        try {
            await connection.query('DELETE FROM users WHERE id = ?', [userId]);
        } catch (err) {
            console.error(`Error deleting from users:`, err.message);
            throw err;
        }

        await connection.rollback(); // Rollback so we don't actually delete
        console.log('Test successful, all queries are valid.');
    } catch (error) {
        await connection.rollback();
        console.error('Test Failed. Final error:', error);
    } finally {
        connection.release();
        process.exit(0);
    }
}

testDelete();
