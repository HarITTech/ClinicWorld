const Doctor = require('../../models/doctors');
const User = require('../../models/userRegistration');

const getOldAppointments = async (req, res) => {
    const userId = req.params.userId;
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const allDoctors = await Doctor.find({});

        let oldAppointments = [];

        allDoctors.forEach((doctor) => {
            const matchedAppointments = doctor.appointments.filter(appt =>
                appt.userId.toString() === userId &&
                appt.appointmentDate < today
            );

            if (matchedAppointments.length > 0) {
                // Attach doctor info to each appointment
                matchedAppointments.forEach(appt => {
                    oldAppointments.push({
                        ...appt.toObject(),
                        doctorName: doctor.name,
                        doctorId: doctor._id
                    });
                });
            }
        });

        return res.status(200).json({
            success: true,
            count: oldAppointments.length,
            oldAppointments
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getOldAppointments };
