const nodemailer = require('nodemailer');
require('dotenv').config();

// Gmail transporter (needs Render paid plan because SMTP is blocked on free)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: process.env.SMTP_USER,  // Gmail address
        pass: process.env.SMTP_PASS,  // Gmail App Password
    }
});

const sendEmailOfUsernamePassword = async (email, password, changePasswordLink) => {
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

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Mail sent to", email);
    } catch (err) {
        console.error("❌ Error sending mail:", err.message);
    }
};

const forgotPasswordMail = async (email, name, resetLink) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
      <p>Hello ${name},</p>
      <p>You requested to reset your password. Please click the link below:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>This link will expire in 1 hour.</p>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Password reset mail sent to", email);
    } catch (err) {
        console.error("❌ Error sending reset mail:", err.message);
    }
};

module.exports = { sendEmailOfUsernamePassword, forgotPasswordMail };
