const { pool } = require('./config/database');

async function testDeleteUser(userId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Delete user-related records first to handle foreign key constraints
        await connection.query('DELETE FROM earnings_logs WHERE user_id = ?', [userId]);
        await connection.query('DELETE FROM task_completions WHERE user_id = ?', [userId]);
        await connection.query('DELETE FROM withdrawals WHERE user_id = ?', [userId]);
        await connection.query('DELETE FROM referrals WHERE referrer_id = ? OR referred_id = ?', [userId, userId]);
        await connection.query('DELETE FROM notifications WHERE user_id = ?', [userId]);
        await connection.query('DELETE FROM vip_requests WHERE user_id = ?', [userId]);

        // Finally delete the user
        await connection.query('DELETE FROM users WHERE id = ?', [userId]);

        await connection.commit();
        console.log('User completely deleted from the system');
    } catch (error) {
        await connection.rollback();
        console.error('SQL Error:', error);
    } finally {
        connection.release();
        process.exit(0);
    }
}

testDeleteUser(35); // Test with a dummy user id that exists
