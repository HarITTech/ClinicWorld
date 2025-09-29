const Doctors = require('../../models/doctors');
const bcrypt = require('bcrypt');

const changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const doctorId = req.params.id;
    try {
        const doctor = await Doctors.findById(doctorId);

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                msg: "Please provide all required fields"
            })
        }

        if(!doctor){
            return res.status(404).json({
                success: false,
                msg: "Doctor not found with this ID"
            })
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success: false,
                msg: "New password and confirm password do not match"
            })
        }

        // Check if old password matches
        const isMatch = await bcrypt.compare(oldPassword, doctor.password);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                msg: "Old password is incorrect"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        doctor.password = hashedPassword;
        await doctor.save();

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

module.exports = { changePassword }