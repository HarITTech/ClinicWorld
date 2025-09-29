const Doctor = require('../../models/doctors');

const searchCompletedAppts = async (req, res) => {
    const doctorId = req.params.doctorId;
    const searchQuery = req.params.searchQuery;

    try {
        const doctor = await Doctor.findById(doctorId);
        if(!doctor){
            return res.status(404).json({
                success: false,
                message: 'Doctor not found.'
            })
        }

        // Filter completed appointments based on search query
        const completedAppointments = doctor.appointments.filter(
            (appt)=> appt.patientStatus === 'completed' &&
            ((appt.patientAge.toString().includes(searchQuery)) || (appt.patientAge.toString().includes(searchQuery)) || (appt.appointmentDate.includes(searchQuery)))
        );

        return res.status(200).json({
            success: true,
            completedAppointments: completedAppointments
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { searchCompletedAppts }