const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailOfUsernamePassword = async (email, password, changePasswordLink) => {
    const msg = {
        to: email,
        from: process.env.MAIL_FROM,  // must match verified sender
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
        await sgMail.send(msg);
        console.log("✅ Mail sent to", email);
    } catch (err) {
        console.error("❌ Error sending mail:", err.message);
    }
};

const forgotPasswordMail = async (email, name, resetLink) => {
    const msg = {
        to: email,
        from: process.env.MAIL_FROM,
        subject: 'Password Reset Request',
        html: `
      <p>Hello ${name},</p>
      <p>You requested to reset your password. Please click the link below:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>This link will expire in 1 hour.</p>
    `
    };

    try {
        await sgMail.send(msg);
        console.log("✅ Password reset mail sent to", email);
    } catch (err) {
        console.error("❌ Error sending reset mail:", err.message);
    }
};

module.exports = { sendEmailOfUsernamePassword, forgotPasswordMail };
