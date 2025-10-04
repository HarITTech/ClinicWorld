const User = require('../models/userRegistration');
const Doctor = require('../models/doctors');
const randomString = require('randomstring');
const { forgotPasswordMail } = require('../helpers/mailer');
const bcrypt = require('bcrypt');

// Common function to find account (User or Doctor)
const findAccount = async (email) => {
    let account = await User.findOne({ email });
    if (!account) {
        account = await Doctor.findOne({ email });
    }
    return account;
};

// Forgot password for both User and Doctor
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const account = await findAccount(email);

        if (!account) {
            return res.status(400).json({
                success: false,
                message: "User/Doctor not found."
            });
        }

        const resetToken = randomString.generate(32);
        account.resetPasswordToken = resetToken;
        account.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await account.save();

        const resetLink = `https://clinic-world.vercel.app/reset-password?token=${resetToken}`;

        await forgotPasswordMail(account.email, account.fullName || account.name, resetLink);

        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Reset password for both User and Doctor
const resetPassword = async (req, res) => {
    const { token } = req.query;
    const { password, confirmPassword } = req.body;

    try {
        let account = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!account) {
            account = await Doctor.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });
        }

        if (!account) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token."
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match."
            });
        }

        account.password = await bcrypt.hash(password, 10);
        account.resetPasswordToken = undefined;
        account.resetPasswordExpires = undefined;

        await account.save();

        return res.status(200).json({
            success: true,
            message: "Password has been reset successfully."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { forgotPassword, resetPassword };
