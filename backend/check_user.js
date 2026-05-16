const mysql = require('mysql2/promise');

async function checkUser() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'gpt_earn'
    });

    const [rows] = await connection.execute('SELECT id, email, status, email_verified, email_verification_token FROM users WHERE email="creatixstudio008@gmail.com"');
    console.log(rows);
    process.exit(0);
}

checkUser().catch(console.error);
