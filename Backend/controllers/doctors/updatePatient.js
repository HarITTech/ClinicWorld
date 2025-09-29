const Doctor = require("../../models/doctors");

const updateStatus = async (req, res) => {
    const doctorId = req.params.doctorId;
    const appointmentId = req.params.appointmentId;
    const { status } = req.body;

    const allowedStatus = ['inProcess', 'completed', 'notCheck'];
    const today = new Date().toISOString().split('T')[0];

    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        const todaysAppointments = doctor.appointments.filter(
            (appt) => appt.appointmentDate === today
        );

        const toUpdate = todaysAppointments.find(appt => appt._id.toString() === appointmentId);

        if (!toUpdate) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found."
            });
        }

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed values are: ${allowedStatus.join(', ')}`
            });
        }

        // Update the patient status
        await Doctor.updateOne(
            { _id: doctorId, "appointments._id": appointmentId },
            { $set: { "appointments.$.patientStatus": status } }
        );

        return res.status(200).json({
            success: true,
            message: "Patient status updated successfully",
            appointmentId,
            status
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = { updateStatus };