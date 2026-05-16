const nodemailer = require('nodemailer');

async function testSend() {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'muhammadrayan182@gmail.com',
            pass: 'skom boyh lhpz whpw'.replace(/\s+/g, '') // strip spaces just in case
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        const info = await transporter.sendMail({
            from: '"PrimeLoot Test" <muhammadrayan182@gmail.com>',
            to: 'creatixstudio008@gmail.com',
            subject: 'Test Email from GPT',
            text: 'This is a test email.'
        });
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Send failed:', error);
    }
}

testSend();
