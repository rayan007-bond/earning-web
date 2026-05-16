const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : undefined
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 10000,  // 10 seconds to connect
    greetingTimeout: 10000,    // 10 seconds for greeting
    socketTimeout: 15000       // 15 seconds for socket
});

const sendEmail = async (to, subject, html) => {
    try {
        const fromEmail = process.env.EMAIL_FROM || process.env.SMTP_USER;
        const mailOptions = {
            from: `"PrimeLoot" <${fromEmail}>`,
            to,
            subject,
            html
        };

        // Race between sending email and a 20-second timeout
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Email send timed out after 20s')), 20000)
        );

        await Promise.race([transporter.sendMail(mailOptions), timeoutPromise]);
        return true;
    } catch (error) {
        console.error('Email send error:', error.message);
        return false;
    }
};

const sendVerificationEmail = async (email, token) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">PrimeLoot</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
                <h2 style="color: #1f2937; text-align: center;">Verify Your Email</h2>
                <p style="color: #6b7280; text-align: center;">Thank you for registering! Please use the 6-digit verification code below to activate your account.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <div style="background: #ffffff; border: 2px dashed #764ba2; padding: 20px; display: inline-block; border-radius: 10px;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">${token}</span>
                    </div>
                </div>
                
                <p style="color: #6b7280; text-align: center;">Return to the website and enter this code to complete your registration.</p>
                <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 30px;">If you didn't create an account, you can safely ignore this email.</p>
            </div>
        </div>
    `;

    return sendEmail(email, 'Verify Your Email - PrimeLoot', html);
};

const sendPasswordResetEmail = async (email, token) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">PrimeLoot</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
                <h2 style="color: #1f2937;">Reset Your Password</h2>
                <p style="color: #6b7280;">We received a request to reset your password. Click the button below to set a new password.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Reset Password</a>
                </div>
                <p style="color: #9ca3af; font-size: 12px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
            </div>
        </div>
    `;

    return sendEmail(email, 'Reset Your Password - PrimeLoot', html);
};

const sendWithdrawalNotification = async (email, status, amount) => {
    const statusMessages = {
        pending: 'Your withdrawal request has been received and is pending approval.',
        approved: 'Your withdrawal has been approved and is being processed.',
        rejected: 'Your withdrawal request has been rejected. Please contact support for more information.',
        completed: 'Your withdrawal has been completed successfully!'
    };

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">PrimeLoot</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
                <h2 style="color: #1f2937;">Withdrawal Update</h2>
                <p style="color: #6b7280;">${statusMessages[status]}</p>
                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <p style="margin: 0; color: #1f2937;"><strong>Amount:</strong> $${amount.toFixed(2)}</p>
                    <p style="margin: 10px 0 0; color: #1f2937;"><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
                </div>
            </div>
        </div>
    `;

    return sendEmail(email, `Withdrawal ${status.charAt(0).toUpperCase() + status.slice(1)} - PrimeLoot`, html);
};

const sendDailyTasksEmail = async (email, username, newTasksCount) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const loginUrl = `${frontendUrl}/login`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">PrimeLoot</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
                <h2 style="color: #1f2937;">Hello ${username}!</h2>
                <p style="color: #6b7280;">Good news! There are <strong>${newTasksCount} new tasks</strong> waiting for you on PrimeLoot.</p>
                <p style="color: #6b7280;">Log in now to complete them and earn money before they expire.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${loginUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Start Earning</a>
                </div>
            </div>
        </div>
    `;

    return sendEmail(email, 'New Tasks Available! - PrimeLoot', html);
};

module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendWithdrawalNotification,
    sendDailyTasksEmail
};
