const User = require('../../models/userRegistration');
const bcrypt = require('bcrypt')

const changePass = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                msg: "Please provide all required fields"
            })
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found."
            })
        }

        // Check if old password matches
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                msg: "Old password is incorrect"
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                msg: "New password and confirm password do not match"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            msg: "Password changed successfully"
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

module.exports = { changePass }