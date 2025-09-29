const Doctor = require('../../models/doctors');

const getOldCompletedAppts = async(req, res) => {
    const doctorId = req.params.doctorId;
    const today = new Date().toISOString().split('T')[0];

    try {
        const doctor = await Doctor.findById(doctorId);
        if(!doctor){
            return res.status(404).json({
                success: false,
                message: 'Doctor not found.'
            })
        }

        // Filter old appointments from embedded array
        const oldAppointments = doctor.appointments.filter(
            (appts) => appts.appointmentDate < today && appts.patientStatus === 'completed'
        )

        return res.status(200).json({
            success: true,
            oldAppointments: oldAppointments
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getOldNotCheckAppts = async(req, res) => {
    const doctorId = req.params.doctorId;
    const today = new Date().toISOString().split('T')[0];

    try {
        const doctor = await Doctor.findById(doctorId);
        if(!doctor){
            return res.status(404).json({
                success: false,
                message: 'Doctor not found.'
            })
        }

        // Filter old appointments from embedded array
        const oldAppointments = doctor.appointments.filter(
            (appts) => appts.appointmentDate < today && appts.patientStatus === 'notCheck'
        )

        return res.status(200).json({
            success: true,
            oldAppointments: oldAppointments
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { getOldCompletedAppts, getOldNotCheckAppts };