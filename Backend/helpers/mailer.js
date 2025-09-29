const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure the transporter for nodemailer using Gmail and environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    requireTLS: true,
    auth: {
        user: 'adityahedau293@gmail.com', // Ideally, use process.env.SMTP_MAIL
        pass: 'lakgccsbsagdiiht' // Ideally, use process.env.SMTP_PASS
    }
});

const sendEmailOfUsernamePassword = async(email, password, changePasswordLink) => {
    // const changePasswordLink = `http://localhost:4200/change-password/${doctorId}`;

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Your Login Credentials',
        html: `
            <p>Welcome! Here are your login details:</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
            <br/>
            <p>If you want to change your password, click the link below:</p>
            <a href="${changePasswordLink}">${changePasswordLink}</a>
            <p>This link will expire in 1 hour.</p>
        `
    };

    await transporter.sendMail(mailOptions)
}

const forgotPasswordMail = async(email, name, resetLink) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Password Reset Request',
        html:`<p>Hello ${name},</p>
        <p>You requested to reset your password. Please click the link below:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link will expire in 1 hour.</p>`
    };

    await transporter.sendMail(mailOptions)
}

module.exports = { sendEmailOfUsernamePassword, forgotPasswordMail }