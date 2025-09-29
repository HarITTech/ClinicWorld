const Doctor = require("../../models/doctors");

const getSingleAppt = async (req, res) => {
    const doctorId = req.params.doctorId;
    const appointmentId = req.params.appointmentId;

    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }
        const appointment = doctor.appointments.find(appt => appt._id.toString() === appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }
        return res.status(200).json({
            success: true,
            appointment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = { getSingleAppt };