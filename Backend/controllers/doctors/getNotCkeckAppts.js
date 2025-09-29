const Doctor = require('../../models/doctors');

const getNotCheckAppts = async (req, res) => {
    const doctorId = req.params.doctorId;

    const today = new Date().toISOString().split('T')[0];

    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // Filter today's appointments from embedded array
        const todaysNotCheckAppointments = doctor.appointments.filter(
            (appt) => appt.appointmentDate === today && appt.patientStatus === 'notCheck'
        );

        return res.status(200).json({
            success: true,
            NotCheckAppointments: todaysNotCheckAppointments
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getNotCheckAppts };
