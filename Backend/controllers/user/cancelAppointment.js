const Doctor = require('../../models/doctors');

const cancelAppointment = async (req, res) => {
    const { doctorId, appointmentId } = req.params;

    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Find appointment index
        const index = doctor.appointments.findIndex(
            appt => appt._id.toString() === appointmentId
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Remove appointment
        doctor.appointments.splice(index, 1);

        // Save updated doctor record
        await doctor.save();

        return res.status(200).json({
            success: true,
            message: 'Appointment cancelled successfully'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { cancelAppointment };
