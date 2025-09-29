const User = require('../../models/userRegistration');
const randomString = require('randomstring');
const { forgotPasswordMail } = require('../../helpers/mailer');
const bcrypt = require('bcrypt');

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            });
        }

        const resetToken = randomString.generate(32);

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetLink = `http://127.0.0.1:6400/reset-password?token=${resetToken}`;

        await forgotPasswordMail(user.email, user.fullName, resetLink);
        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    };
}

const resetPassword = async(req, res) => {
    const { token } = req.query;
    const { password, confirmPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid or expire token"
            });
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm password are not match"
            });
        }

        user.password = await bcrypt.hash(password, 10);

        user.resetPasswordToken = undefined;
        user .resetPasswordExpires = undefined;

        user.save();

        return res.status(200).json({
            success: true,
            message: "Password has been reset successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { forgotPassword, resetPassword }