const nodemailer = require('nodemailer');

const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS length:', pass.length);
console.log('SMTP_PASS (masked):', pass.substring(0, 4) + '****');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: pass
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
});

async function test() {
    try {
        console.log('Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection verified!');
        
        console.log('Sending test email...');
        await transporter.sendMail({
            from: `"PrimeLoot" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: 'Test Email from PrimeLoot',
            html: '<h1>It works!</h1><p>Your SMTP config is correct.</p>'
        });
        console.log('✅ Test email sent successfully!');
    } catch (e) {
        console.error('❌ SMTP Error:', e.message);
    }
    process.exit(0);
}
test();
