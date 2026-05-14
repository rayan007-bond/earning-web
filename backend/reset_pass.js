const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function run() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'gpt_earn'
    });
    
    try {
        const password = 'rayan123';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        await pool.query(
            'UPDATE users SET password_hash = ?, email_verified = 1 WHERE email = ?',
            [hash, 'muhammadrayan182@gmail.com']
        );
        
        console.log('Successfully updated password for muhammadrayan182@gmail.com');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}
run();
